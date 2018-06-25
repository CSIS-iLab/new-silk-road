"""
Normalize power_plant_data records using information in the Source Variables Matrix worksheet.
(filtering and merging happen elsewhere / later.)
"""
import logging
from . import excel

log = logging.getLogger(__name__)

months = {
    "Jan": 1,
    "January": 1,
    "Feb": 2,
    "February": 2,
    "Mar": 3,
    "March": 3,
    "Apr": 4,
    "April": 4,
    "May": 5,
    "Jun": 6,
    "June": 6,
    "Jul": 7,
    "July": 7,
    "Aug": 8,
    "August": 8,
    "Sep": 9,
    "September": 9,
    "Oct": 10,
    "October": 10,
    "Nov": 11,
    "November": 11,
    "Dec": 12,
    "December": 12,
}


def field_names_from_matrix(records, **params):
    """for fields where the field name is variable among sources,
    set the record field based on the source matrix (key mapping by dataset))
    """
    source_variables = params["source_variables"]
    for record in records:
        dataset = record["Dataset"]
        for key in [
            "Power Plant Name",
            "Infrastructure Type",
            "Country",
            "Project Name",
            "Project Status",
            "Decommissioning Day",
            "Decommissioning Month",
            "Start Day",
            "Start Month",
            "Start Year",
            "Construction Start Day",
            "Construction Start Month",
            "Construction Start Year",
            "Completion Day",
            "Completion Month",
            "Completion Year",
            "New Construction",
            "Latitude",
            "Longitude",
            "Initiative",
            "Consultant",
            "Implementing Agency",
            "Sources",
            "Notes",
            "Funder 1",
            "Funding Amount 1",
            "Funding Currency 1",
            "Funder 2",
            "Funding Amount 2",
            "Funding Currency 2",
            "Project Fuel 1",
            "Project Fuel 2",
            "Project Fuel 3",
            "Project Fuel 4",
        ]:
            source_var = source_variables[dataset][key]
            # "all cases": the value to use is given in source_var before the parens
            if (
                isinstance(source_var, str)
                and re.search(r"\(.*?all cases\)", source_var, flags=re.I) is not None
            ):
                record[key] = re.sub(r"\(.*?all cases.*?\)", "", source_var, flags=re.I).strip()
            # null values
            elif source_var in ["NA", None] or source_var not in record:
                record[key] = None
            # otherwise, the value is in the record under the source_var
            else:
                record[key] = record[source_var]
        if record[key] is not None:
            log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def region_from_country(records, **params):
    """use the Countries Regions Lookup to set the region value"""
    countries_regions = params["countries_regions"]
    key = "Region"
    for record in records:
        dataset = record["Dataset"]
        if record.get("Country") is None or countries_regions.get(record["Country"]) is None:
            record[key] = None
        else:
            record[key] = countries_regions[record["Country"]]["Regions"]
        if record[key] is not None:
            log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def plant_project_status(records, **params):
    """provide Plant and Project Status according to Source Variables matrix.
    (no Status Conversions at this point – that's a merge step)
    """
    source_variables = params["source_variables"]
    for record in records:
        dataset = record["Dataset"]
        status_key = source_variables[dataset]["Project Status"]
        plant_key = source_variables[dataset]["Power Plant Name"]
        project_key = source_variables[dataset]["Project Name"]
        if status_key in [None, "NA"]:
            record["Plant Status"] = None
            record["Project Status"] = None
        else:
            record["Project Status"] = record[status_key]
            if project_key is not None and record.get(plant_key) == record.get(project_key):
                record["Plant Status"] = record["Project Status"]
            else:
                record["Plant Status"] = None
        if record["Plant Status"] is not None or record["Project Status"] is not None:
            log.debug(
                f'{dataset}: "Plant Status": "{record["Plant Status"]}"'
                + f' "Project Status": {record["Project Status"]}'
            )
    return records


def plant_date_online(records, **params):
    """Plant Day/Month/Year Online – uses Date/Month/Year Online when Plant Name = Project Name"""
    source_variables = params["source_variables"]
    keys = {
        "Plant Day Online": "Date Online",
        "Plant Month Online": "Month Online",
        "Plant Year Online": "Year Online",
    }
    for record in records:
        dataset = record["Dataset"]
        for key, source_var in keys.items():
            plant_name = record[source_variables[dataset]["Power Plant Name"]]
            project_name = record.get(source_variables[dataset].get("Project Name"))
            if (
                source_variables[dataset][key] in [None, "NA"]
                or record.get(source_var) is None
                or plant_name != project_name
            ):
                record[key] = None
            else:
                if "Month" in key:
                    record[key] = months[record[source_var]]
                else:
                    record[key] = record[source_var]
            if record[key] is not None:
                log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def decommissioning_year(records, **params):
    source_variables = params["source_variables"]
    key = "Decommissioning Year"
    for record in records:
        dataset = record["Dataset"]
        source_var = re.sub(
            r"^.*(Decommission\w+ Year).*$",
            r"\1",
            source_variables[dataset].get(key) or "",
            flags=re.I,
        )
        plant_name = record[source_variables[dataset]["Power Plant Name"]]
        project_name = record.get(source_variables[dataset].get("Project Name"))
        if (
            source_var in [None, "NA"]
            or record.get(source_var) is None
            or plant_name != project_name
        ):
            record[key] = None
        else:
            record[key] = record[source_var]
        if record[key] is not None:
            log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def owner_and_stake(records, **params):
    source_variables = params["source_variables"]
    keys = ["Owner 1", "Owner 1 Stake"]
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            if source_var in [None, "NA"]:
                record[key] = None
            else:
                record[key] = record[source_var]
            if record[key] is not None:
                log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def plant_fuels(records, **params):
    source_variables = params["source_variables"]
    keys = [f"Plant Fuel {n}" for n in range(1, 5)]  # 1..4
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            if source_var in [None, "NA"]:
                record[key] = None
            elif "all cases" in source_var.lower():
                record[key] = re.sub(r"\([^\(\)]+\)", "", source_var).strip()
            elif "fuel used category" in source_var.lower():
                record[key] = record["Fuel Used Category"]
            elif "primary fuel" in source_var.lower():
                record[key] = record["Primary Fuel"]
            else:
                record[key] = record[source_var]
            if record[key] is not None:
                log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def operator(records, **params):
    source_variables = params["source_variables"]
    keys = ["Operator 1", "Operator 2"]
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            if source_var in [None, "NA"]:
                record[key] = None
            else:
                record[key] = record["Operator"]
            if record[key] is not None:
                log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def plant_capacity_w_unit(records, **params):
    source_variables = params["source_variables"]
    keys = ["Plant Capacity"]
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            plant_name = record[source_variables[dataset]["Power Plant Name"]]
            project_name = record.get(source_variables[dataset].get("Project Name"))
            if source_var in [None, "NA"]:
                record[key] = None
            elif "Plant Capacity from row" in source_var:
                source_var = "Plant Capacity (MW)"
                if plant_name == project_name:
                    record[key] = record[source_var]
                else:
                    record[key] = None
            else:
                record[key] = record[source_var]
            record[key + " Unit"] = "MW" if record[key] is not None else None
            if record[key] is not None:
                log.debug(f"{dataset}: {key}: {record[key]} {record[key+' Unit']}")
    return records


def project_capacity(records, **params):
    source_variables = params["source_variables"]
    keys = ["Project Capacity"]
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            if source_var in [None, "NA"]:
                record[key] = None
            elif "active capacity" in source_var.lower():
                record[key] = (
                    record["Active Capacity (MW)"]
                    or record["Pipeline Capacity (MW)"]
                    or record["Discontinued Capacity (MW)"]
                )
            else:
                record[key] = record[source_var]
            record[key + " Unit"] = "MW" if record[key] is not None else None
            if record[key] is not None:
                log.debug(f"{dataset}: {key}: {record[key]} {record[key+' Unit']}")
    return records


def plant_output_w_unit_year(records, **params):
    source_variables = params["source_variables"]
    keys = ["Plant Output"]
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            plant_name = record[source_variables[dataset]["Power Plant Name"]]
            project_name = record[source_variables[dataset].get("Power Plant Name")]
            if dataset == "WRI":
                record[key] = (
                    record["generation_gwh_2016"]
                    or record["generation_gwh_2015"]
                    or record["generation_gwh_2014"]
                    or record["generation_gwh_2013"]
                    or None
                )
                record[key + " Unit"] = "GWh" if record[key] is not None else None
                record[key + " Year"] = (
                    (record["generation_gwh_2016"] and 2016)
                    or (record["generation_gwh_2015"] and 2015)
                    or (record["generation_gwh_2014"] and 2014)
                    or (record["generation_gwh_2013"] and 2013)
                    or None
                )
            elif source_var in [None, "NA"]:
                record[key] = None
                record[key + " Unit"] = None
                record[key + " Year"] = None
            elif "annual output" in source_var.lower():
                if plant_name == project_name:
                    record[key] = record["Annual Output"]
                    record[key + " Unit"] = (
                        record["Annual Output Unit"].split("/")[0]
                        if record[key] is not None
                        else None
                    )
                    record[key + " Year"] = record["Generation Year"]
                else:
                    record[key] = None
                    record[key + " Unit"] = None
                    record[key + " Year"] = None
            else:
                record[key] = record[source_var]
                record[key + " Unit"] = re.sub(
                    r"\([^\(\)]*\)", r"", source_variables[dataset][key + " Unit"], flags=re.I
                ).strip()
                record[key + " Year"] = None
        if record[key] is not None:
            log.debug(
                f"{dataset}: {key}: {record[key]} {record[key+' Unit']} {record[key+' Year']}"
            )
    return records


def project_output_w_unit_year(records, **params):
    source_variables = params["source_variables"]
    keys = ["Project Output"]
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            plant_name = record[source_variables[dataset]["Power Plant Name"]]
            project_name = record.get(source_variables[dataset].get("Project Name"))
            if source_var in [None, "NA"] or plant_name == project_name:
                record[key] = None
                record[key + " Unit"] = None
                record[key + " Year"] = None
            else:
                record[key] = record["Annual Output"]
                record[key + " Unit"] = (
                    record["Annual Output Unit"].split("/")[0] if record[key] is not None else None
                )
                record[key + " Year"] = record["Generation Year"]
        if record[key] is not None:
            log.debug(
                f"{dataset}: {key}: {record[key]} {record[key+' Unit']} {record[key+' Year']}"
            )
    return records


def estimated_plant_output_w_unit(records, **params):
    source_variables = params["source_variables"]
    keys = ["Estimated Plant Output"]
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            if source_var in [None, "NA"]:
                record[key] = None
                record[key + " Unit"] = None
            elif "average output" in source_var.lower():
                if record["Average Output"] is not None:
                    # format is "NNN.NN XWh/annum"
                    record[key] = excel.value_to_float(record["Average Output"].split(" ")[0])
                    record[key + " Unit"] = record["Average Output"].split(" ")[-1].split("/")[0]
                else:
                    record[key] = None
                    record[key + " Unit"] = None
            else:
                record[key] = record[source_var]
                record[key + " Unit"] = "GWh"
            # convert GWh => MWh
            if record[key] is not None and record[key+ " Unit"] == "GWh":
                record[key] *= 1000
                record[key + " Unit"] = "MWh"
            if record[key] is not None:
                log.debug(f"{dataset}: {key}: {record[key]} {record[key+' Unit']}")
    return records


def estimated_project_output(records, **params):
    source_variables = params["source_variables"]
    keys = ["Estimated Project Output"]
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            if source_var in [None, "NA"]:
                record[key] = None
                record[key + " Unit"] = None
            elif source_var == "Average Output":
                if record[source_var] is not None:
                    record[key] = excel.value_to_float(record[source_var].split(" ")[0])
                    record[key + " Unit"] = record[source_var].split(" ")[-1].split("/")[0]
                else:
                    record[key] = None
                    record[key + " Unit"] = None
            else:
                raise ValueError(
                    f'invalid source variable: dataset="{dataset}", key="{key}", val="{source_var}"'
                )
            # convert GWh => MWh
            if record[key] is not None and record[key+ " Unit"] == "GWh":
                record[key] *= 1000
                record[key + " Unit"] = "MWh"
            if record[key] is not None:
                log.debug(f"{dataset}: {key}: {record[key]} {record[key+' Unit']}")
    return records


def project_co2_emissions(records, **params):
    source_variables = params["source_variables"]
    keys = ["Project CO2 Emissions"]
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            if source_var in [None, "NA"]:
                record[key] = None
                record[key + " Unit"] = None
            elif source_var == "CO2 Emissions (Tonnes per annum)":
                record[key] = excel.value_to_float(record[source_var])
                record[key + " Unit"] = "Tonnes per annum"
            else:
                raise ValueError(
                    f'invalid source variable: dataset="{dataset}", key="{key}", val="{source_var}"'
                )
            if record[key] is not None:
                log.debug(f"{dataset}: {key}: {record[key]} {record[key+' Unit']}")
    return records


def plant_co2_emmissions(records, **params):
    source_variables = params["source_variables"]
    keys = ["Plant CO2 Emissions"]
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            plant_name = record[source_variables[dataset]["Power Plant Name"]]
            project_name = record.get(source_variables[dataset].get("Project Name"))
            if source_var in [None, "NA"]:
                record[key] = None
                record[key + " Unit"] = None
            elif "CO2 Emissions (Tonnes per annum)" in source_var:
                if plant_name == project_name:
                    record[key] = excel.value_to_float(record["CO2 Emissions (Tonnes per annum)"])
                    record[key + " Unit"] = "Tonnes per annum" if record[key] is not None else None
                else:
                    record[key] = None
                    record[key + " Unit"] = None
            else:
                raise ValueError(
                    f'invalid source variable: dataset="{dataset}", key="{key}", val="{source_var}"'
                )
            if record[key] is not None:
                log.debug(f"{dataset}: {key}: {record[key]} {record[key+' Unit']}")
    return records


def grid_connected(records, **params):
    source_variables = params["source_variables"]
    keys = ["Grid Connected"]
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            if record.get((source_var or "").split("(")[0].strip()) is not None:
                record[key] = True
            else:
                record[key] = None
            if record[key] is not None:
                log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def manufacturers(records, **params):
    source_variables = params["source_variables"]
    keys = [
        "Manufacturer 1",
        "Manufacturer 2",
        "Manufacturer 3",
        "Manufacturer 4",
        "Manufacturer 5",
    ]
    for record in records:
        dataset = record["Dataset"]
        plant_name = record[source_variables[dataset]["Power Plant Name"]]
        project_name = record.get(source_variables[dataset].get("Project Name"))
        for key in keys:
            source_var = source_variables[dataset][key]
            record[key] = None
            if "from" in source_var.lower() and "matching plant" in source_var.lower():
                if plant_name == project_name:
                    source_key = source_var.split("from")[0].strip()
                    record[key] = record[source_key]
            elif source_var not in [None, "NA"]:
                record[key] = record[source_var]
            if record[key] is not None:
                log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def contractors(records, **params):
    source_variables = params["source_variables"]
    keys = [f"Contractor {n}" for n in range(1, 13)]  # 1..12
    for record in records:
        dataset = record["Dataset"]
        plant_name = record[source_variables[dataset]["Power Plant Name"]]
        project_name = record.get(source_variables[dataset].get("Project Name"))
        for key in keys:
            source_var = source_variables[dataset][key]
            if source_var in [None, "NA"]:
                record[key] = None
            elif "EPC Contractor from row" in source_var:
                if plant_name == project_name:
                    record[key] = record["EPC Contractor"]
                else:
                    record[key] = None
            elif "See Contractor 1" in source_var:
                record[key] = None
            elif source_var in record:
                record[key] = record[source_var]
            else:
                raise ValueError(
                    f'invalid source variable: dataset="{dataset}" key="{key}" val="{source_var}"'
                )
            if record[key] is not None:
                log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def sox_reduction_system(records, **params):
    source_variables = params["source_variables"]
    keys = ["SOx Reduction System"]
    for record in records:
        dataset = record["Dataset"]
        plant_name = record[source_variables[dataset]["Power Plant Name"]]
        project_name = record.get(source_variables[dataset].get("Project Name"))
        for key in keys:
            source_var = source_variables[dataset][key]
            if source_var in [None, "NA"]:
                record[key] = None
            elif "sox ctrl system" in source_var.lower():
                if record["SOx Ctrl System"] is not None or record["FGP Ctrl System"] is not None:
                    record[key] = True
                elif record["SOx Ctrl System"] == False and record["FGP Ctrl System"] == False:
                    record[key] = False
                else:
                    record[key] = None
            else:
                raise ValueError(
                    f'invalid source variable: dataset="{dataset}", key="{key}", val="{source_var}"'
                )
            if record[key] is not None:
                log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def nox_reduction_system(records, **params):
    source_variables = params["source_variables"]
    keys = ["NOx Reduction System"]
    for record in records:
        dataset = record["Dataset"]
        plant_name = record[source_variables[dataset]["Power Plant Name"]]
        project_name = record.get(source_variables[dataset].get("Project Name"))
        for key in keys:
            source_var = source_variables[dataset][key]
            if source_var in [None, "NA"]:
                record[key] = None
            elif "nox ctrl system" in source_var.lower():
                if record["NOx Ctrl System"] is None:
                    record[key] = True
                else:
                    record[key] = False
            else:
                raise ValueError(
                    f'invalid source variable: dataset="{dataset}", key="{key}", val="{source_var}"'
                )
            if record[key] is not None:
                log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def total_cost_w_currency(records, **params):
    source_variables = params["source_variables"]
    key = "Total Cost"
    for record in records:
        dataset = record["Dataset"]
        plant_name = record[source_variables[dataset]["Power Plant Name"]]
        project_name = record.get(source_variables[dataset].get("Project Name"))
        source_var = (source_variables[dataset][key] or "NA").strip()
        if source_var in [None, "NA"]:
            record[key] = None
        elif source_var == "CAPEX (USD) where data is not italicized":
            if record["CAPEX (USD)"] is not None and "<i>" not in str(record["CAPEX (USD)"]):
                record[key] = excel.value_to_float(record["CAPEX (USD)"])
            else:
                record[key] = None
        elif source_var == "Capex USD when Capex Estimated = Actual, otherwise NULL":
            record[key] = excel.value_to_float(record["Capex USD"])
            if record[key] is not None:
                log.warn(
                    f'{dataset}/{plant_name}/{project_name}\n\t"{key}"={record[key]} — No Capex Estimated or Actual value exists'
                )
        elif source_var in record:
            record[key] = excel.value_to_float(record[source_var])
        else:
            raise ValueError(
                f'invalid source variable: dataset="{dataset}", key="{key}", val="{source_var}"'
            )
        if record[key] is not None:
            record[key] = int(round(record[key], 0))    # convert to integer
            record[key + " Currency"] = "USD"
            log.debug(f"{dataset}: {key}: {record[key]}")
        else:
            record[key + " Currency"] = None
    return records


# def template(records, **params):
#     source_variables = params["source_variables"]
#     keys = []
#     for record in records:
#         dataset = record["Dataset"]
#         plant_name = record[source_variables[dataset]["Power Plant Name"]]
#         project_name = record.get(source_variables[dataset].get("Project Name"))
#         for key in keys:
#             source_var = source_variables[dataset][key]
#             if source_var in [None, "NA"]:
#                 record[key] = None
#             elif True:
#                 pass
#             else:
#                 raise ValueError(
#                     f'invalid source variable: dataset="{dataset}", key="{key}", val="{source_var}"'
#                 )
#             if record[key] is not None:
#                 log.info(f"{dataset}: {key}: {record[key]}")
#     return records


if __name__ == "__main__":
    """assume that we're getting a JSON file and producing a JSON file"""
    import json, os, re, sys, openpyxl, importlib
    from datetime import datetime
    from collections import OrderedDict
    from . import csv, excel

    logging.basicConfig(level=20)

    this = importlib.import_module("power_plant_import.normalize")
    functions = [f for f in [eval(f) for f in dir(this) if "__" not in f] if "function" in str(f)]

    source_matrix_filename = os.path.abspath(sys.argv[1])
    fuel_categories_filename = os.path.abspath(sys.argv[2])
    json_filename = os.path.abspath(sys.argv[3])

    source_matrix = excel.load_workbook_data(source_matrix_filename)

    params = dict(
        source_variables=excel.worksheet_dict(
            source_matrix["Source - Variables Matrix"], "Dataset"
        ),
        countries_regions=excel.worksheet_dict(source_matrix["Country-Region Lookup"], "Countries"),
    )

    with open(json_filename, "r") as f:
        power_plant_data = json.load(f, object_pairs_hook=OrderedDict)

    power_plant_data = csv.reduce_power_plant_data(power_plant_data, *functions, **params)
    output_filename = os.path.join(
        os.path.dirname(json_filename), f"{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    )
    with open(output_filename, "w") as f:
        json.dump(power_plant_data, f, indent=2)
