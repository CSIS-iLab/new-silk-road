"""
Normalize power_plant_data records using information in the Source Variables Matrix worksheet.
(filtering and merging happen elsewhere / later.)
"""
import logging, re, copy
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

# == Helper Functions ==


def __match_org_name(name, org_match_index):
    """given an organization name, try to match it to an organization in the org list 
    using the org_match_index (key: normalized org name, value: canonical org name).
    split values on ';' for matching, then rejoin.
    """
    names = [name for name in [name.strip() for name in name.split(";")] if name != ""]
    match_names = [__norm_match_name(name) for name in names]
    for i, match_name in enumerate(match_names):
        if match_name in org_match_index:
            names[i] = org_match_index[match_name]
    return ";".join(names)


def __norm_match_name(name):
    """given an org name, normalize it for matching purposes
    """
    return re.sub(r"[\W]+", " ", name).strip().lower()


# == Reduce Functions ==


def _00_plant_project_name_type(records, **params):
    """Set the Power Plant Name and the Project Name.
    (This is the first function to be run in this set)
    Power Plant Name for all records in the set = the one that has the highest count in records.
    If this is not a project, Project Name = Power Plant Name.
    """
    from collections import Counter

    source_variables = params["source_variables"]
    names = Counter(
        [record[source_variables[record["Dataset"]]["Power Plant Name"]] for record in records]
    )
    plant_name = max(names, key=names.get).strip()
    for record in records:
        dataset = record["Dataset"]
        record["Source Plant Name"] = record[source_variables[dataset]["Power Plant Name"]]
        if 'GD' in record['Dataset']:
            record["Power Plant Name"] = record['Source Plant Name']
        else:
            record["Power Plant Name"] = plant_name

        # set "Project Name" and "Type"
        record["Project Name"] = (record.get(source_variables[dataset].get("Project Name")) or '').strip()
        if record["Project Name"] not in ["", record["Power Plant Name"]]:
            record["Type"] = "Project"
        else:
            record["Type"] = "Plant"
            record["Project Name"] = record["Power Plant Name"]

        record.move_to_end("Type", last=False)
        record.move_to_end("Project Name", last=False)
        record.move_to_end("Power Plant Name", last=False)

    # if there are no "Project" records for each "Plant" record, then create one
    for plant_record in [record for record in records if record["Type"] == "Plant"]:
        plant_name = plant_record["Power Plant Name"]
        project_records = [
            record
            for record in records
            if record["Type"] == "Project" and record["Power Plant Name"] == plant_name
        ]
        if len(project_records) == 0:
            project_record = copy.deepcopy(plant_record)
            project_record["Type"] = "Project"
            project_record["Project Name"] = "(Project)"
            records.append(project_record)

    # if there is no "Plant" record for each "Project" record, then create one
    for project_record in [record for record in records if record["Type"] == "Project"]:
        plant_name = project_record["Power Plant Name"]
        plant_records = [
            record
            for record in records
            if record["Type"] == "Plant" and record["Power Plant Name"] == plant_name
        ]
        if len(plant_records) == 0:
            plant_record = copy.deepcopy(project_record)
            plant_record["Type"] = "Plant"
            plant_record["Project Name"] = plant_name
            records.insert(records.index(project_record), plant_record)

    return records


def field_names_from_matrix(records, **params):
    """for fields where the field name is variable among sources,
    set the record field based on the source matrix (key mapping by dataset))
    """
    source_variables = params["source_variables"]
    for record in records:
        dataset = record["Dataset"]
        for key in [
            "Infrastructure Type",
            "Country",
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
        if record[key] not in [None, "NA"]:
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
        if record[key] not in [None, "NA"]:
            log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def __plant_status(status, status_conversions):
    if status in status_conversions:
        converted_status = status_conversions[status][
            "Plant Status (If Single/ Universal Project Status)"
        ].strip("*")
        if converted_status == "NULL":
            converted_status = None
        return converted_status
    elif status not in [None, "NA"]:
        return status


def __project_status(status, status_conversions):
    if status in status_conversions:
        converted_status = status_conversions[status]["Recon Equivalent Project Status"].strip("*")
        if converted_status == "NULL":
            converted_status = None
        return converted_status
    elif status not in [None, "NA"]:
        return status


def plant_project_status(records, **params):
    """provide Plant and Project Status according to Source Variables matrix and Status Conversions.
    """
    source_variables = params["source_variables"]
    status_conversions = params["status_conversions"]
    for record in records:
        dataset = record["Dataset"]
        status_key = source_variables[dataset]["Project Status"]
        if status_key in [None, "NA"]:
            record["Plant Status"] = None
            record["Project Status"] = None
        else:
            record["Plant Status"] = __plant_status(record[status_key], status_conversions)
            record["Project Status"] = __project_status(record[status_key], status_conversions)

            log.debug(
                f'{dataset}:{record["Power Plant Name"]}: "Plant Status"="{record["Plant Status"]}"'
            )
            log.debug(
                f'{dataset}:{record["Power Plant Name"]}:{record["Project Name"]}: "Project Status"="{record["Project Status"]}"'
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
            if (
                record["Type"] == "Project"
                or source_variables[dataset][key] in [None, "NA"]
                or record.get(source_var) is None
            ):
                record[key] = None
            else:
                if "Month" in key:
                    source_val = record[source_var]
                    if source_val in [None, "NA"]:
                        record[key] = None
                    else:
                        record[key] = months[source_val]
                else:
                    record[key] = record[source_var]
            if record[key] not in [None, "NA"]:
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
        if (
            record["Type"] == "Project"
            or source_var in [None, "NA"]
            or record.get(source_var) is None
        ):
            record[key] = None
        else:
            record[key] = record[source_var]
        if record[key] not in [None, "NA"]:
            log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def owner_and_stake(records, **params):
    source_variables = params["source_variables"]
    org_match_index = params["org_match_index"]
    keys = ["Owner 1", "Owner 1 Stake"]
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            if source_var in [None, "NA"]:
                record[key] = None
            elif record[source_var] not in [None, "NA"]:
                record[key] = record[source_var]
            else:
                record[key] = None
            # normalize the org name to (an) existing org(s)
            if key == "Owner 1" and record[key] is not None:
                record[key] = __match_org_name(record[key], org_match_index)
            if record[key] not in [None, "NA"]:
                log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def plant_project_fuels(records, **params):
    source_variables = params["source_variables"]
    fuel_types = params["fuel_types"]
    fuel_categories = {
        # normalized keys to match normalized fuel_type values later
        re.sub(r"\W+", " ", ft).strip().lower(): ft
        for ft in [
            fuel_types[key]["Fuel Category"]
            for key in fuel_types
            if fuel_types[key]["Fuel Category"] not in [None, '', 'NA']
        ]
    }
    # normalize the fuel type keys
    for key in list(fuel_types.keys()):
        norm_key = re.sub(r"\W+", " ", key).strip().lower()
        fuel_types[norm_key] = fuel_types.pop(key)
    keys = [f"Plant Fuel {n}" for n in range(1, 5)] + [f"Project Fuel {n}" for n in range(1, 5)]
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            if source_var in [None, "NA"]:
                record[key] = None
            elif "all cases" in source_var.lower():
                record[key] = re.sub(r"\([^\(\)]+\)", "", source_var).strip()
            elif source_var.startswith("Fuel Used Category"):
                record[key] = record["Fuel Used Category"]
            elif source_var.startswith("Primary Fuel"):
                record[key] = record["Primary Fuel"]
            else:
                record[key] = record[source_var]

            # normalize the value using the fuel_types data, and add " Category" values
            if record[key] not in [None, "NA"]:
                if record[key] in fuel_types:
                    # the delimiter is in the "Split" field
                    delimiter = (fuel_types[record[key]]["Split"] or '').strip()
                    if delimiter not in ['', 'FALSE']:
                        vals = [
                            [v.strip(), ""] for v in record[key].split(delimiter) if v.strip() != ""
                        ]
                    else:
                        vals = [[record[key], ""]]
                elif re.search(r"[,/;]", record[key]) is not None:
                    # try splitting on common delimiters: ; , /
                    vals = [
                        [v.strip(), ""] for v in re.split(r"[,/;]", record[key]) if v.strip() != ""
                    ]
                else:
                    vals = [[record[key], ""]]
                for val in vals:
                    fuel_type = re.sub(r"\W+", " ", val[0]).strip().lower()
                    if fuel_type in fuel_types:
                        val[0] = fuel_types[fuel_type]["Fuel"]
                        val[1] = fuel_types[fuel_type]["Fuel Category"]
                    elif fuel_type in fuel_categories:
                        val[0] = val[1] = fuel_categories[fuel_type]
                    else:
                        print(f"VAL NOT IN FUEL TYPES | {dataset} | {record[key]}")
                record[key] = ";".join(str(val[0]) for val in vals)
                record[key + " Category"] = ";".join(str(val[1]) for val in vals)
            else:
                record[key] = None

            if record[key] not in [None, "NA"]:
                log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def operator(records, **params):
    source_variables = params["source_variables"]
    org_match_index = params["org_match_index"]
    keys = ["Operator 1", "Operator 2"]
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            if source_var in [None, "NA"]:
                record[key] = None
            else:
                record[key] = record["Operator"]
            # normalize the org name to (an) existing org(s)
            if record[key] not in [None, "NA"]:
                record[key] = __match_org_name(record[key], org_match_index)
            else:
                record[key] = None
            if record[key] not in [None, "NA"]:
                log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def plant_capacity_w_unit(records, **params):
    source_variables = params["source_variables"]
    keys = ["Plant Capacity"]
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            if source_var in [None, "NA"]:
                record[key] = None
            elif "Plant Capacity from row" in source_var:
                source_var = "Plant Capacity (MW)"
                if record["Type"] == "Plant":
                    record[key] = record[source_var]
                else:
                    record[key] = None
            elif record[source_var] not in [None, "NA"]:
                record[key] = record[source_var]
            else:
                record[key] = None

            if record[key] not in [None, "NA"]:
                record[key] = excel.value_to_float(record[key])
            else:
                record[key] = None

            record[key + " Unit"] = "MW" if record[key] not in [None, "NA"] else None
            if record[key] not in [None, "NA"]:
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
            elif record[source_var] not in [None, "NA"]:
                record[key] = record[source_var]
            else:
                record[key] = None

            if record[key] not in [None, "NA"]:
                record[key] = excel.value_to_float(record[key])
            else:
                record[key] = None

            record[key + " Unit"] = "MW" if record[key] not in [None, "NA"] else None
            if record[key] not in [None, "NA"]:
                log.debug(f"{dataset}: {key}: {record[key]} {record[key+' Unit']}")
    return records


def plant_output_w_unit_year(records, **params):
    source_variables = params["source_variables"]
    keys = ["Plant Output"]
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            if dataset == "WRI":
                record[key] = (
                    record["generation_gwh_2016"]
                    or record["generation_gwh_2015"]
                    or record["generation_gwh_2014"]
                    or record["generation_gwh_2013"]
                    or None
                )
                record[key + " Unit"] = "GWh" if record[key] not in [None, "NA"] else None
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
                if record["Type"] == "Plant":
                    record[key] = record["Annual Output"]
                    record[key + " Unit"] = (
                        record["Annual Output Unit"].split("/")[0]
                        if record[key] not in [None, "NA"]
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

            # convert GWh => MWh
            if record[key] not in [None, "NA"]:
                record[key] = excel.value_to_float(record[key])
                if record[key + " Unit"] == "GWh":
                    record[key] *= 1000
                record[key + " Unit"] = "MWh"
            else:
                record[key] = None

            if record[key] not in [None, "NA"]:
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
            if record["Type"] == "Plant" or source_var in [None, "NA"]:
                record[key] = None
                record[key + " Unit"] = None
                record[key + " Year"] = None
            else:
                record[key] = record["Annual Output"]
                record[key + " Unit"] = (
                    record["Annual Output Unit"].split("/")[0]
                    if record[key] not in [None, "NA"]
                    else None
                )
                record[key + " Year"] = record["Generation Year"]

            # convert GWh => MWh
            if record[key] not in [None, "NA"]:
                record[key] = excel.value_to_float(record[key])
                if record[key + " Unit"] == "GWh":
                    record[key] *= 1000
                record[key + " Unit"] = "MWh"

            if record[key] not in [None, "NA"]:
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
                if record["Average Output"] not in [None, "NA"]:
                    # format is "NNN.NN XWh/annum"
                    record[key] = record["Average Output"].split(" ")[0]
                    record[key + " Unit"] = record["Average Output"].split(" ")[-1].split("/")[0]
                else:
                    record[key] = None
                    record[key + " Unit"] = None
            else:
                record[key] = record[source_var]
                record[key + " Unit"] = "GWh"

            # convert GWh => MWh
            if record[key] not in [None, "NA"]:
                record[key] = excel.value_to_float(record[key])
                if record[key + " Unit"] == "GWh":
                    record[key] *= 1000
                record[key + " Unit"] = "MWh"

            if record[key] not in [None, "NA"]:
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
                    record[key] = record[source_var].split(" ")[0]
                    record[key + " Unit"] = record[source_var].split(" ")[-1].split("/")[0]
                else:
                    record[key] = None
                    record[key + " Unit"] = None
            else:
                raise ValueError(
                    f'invalid source variable: dataset="{dataset}", key="{key}", val="{source_var}"'
                )
            # convert GWh => MWh
            if record[key] not in [None, "NA"]:
                record[key] = excel.value_to_float(record[key])
                if record[key + " Unit"] == "GWh":
                    record[key] *= 1000
                record[key + " Unit"] = "MWh"
            if record[key] not in [None, "NA"]:
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
            elif source_var == "CO2 Emissions (Tonnes per annum)":
                record[key] = excel.value_to_float(record[source_var])
            else:
                raise ValueError(
                    f'invalid source variable: dataset="{dataset}", key="{key}", val="{source_var}"'
                )
            if record[key] not in [None, "NA"]:
                record[key + " Unit"] = "Tonnes per annum"
            else:
                record[key + " Unit"] = None
            if record[key] not in [None, "NA"]:
                log.debug(f"{dataset}: {key}: {record[key]} {record[key+' Unit']}")
    return records


def plant_co2_emmissions(records, **params):
    source_variables = params["source_variables"]
    keys = ["Plant CO2 Emissions"]
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            if source_var in [None, "NA"]:
                record[key] = None
                record[key + " Unit"] = None
            elif "CO2 Emissions (Tonnes per annum)" in source_var:
                if record["Type"] == "Plant":
                    record[key] = excel.value_to_float(record["CO2 Emissions (Tonnes per annum)"])
                else:
                    record[key] = None
            else:
                raise ValueError(
                    f'invalid source variable: dataset="{dataset}", key="{key}", val="{source_var}"'
                )
            if record[key] not in [None, "NA"]:
                record[key + " Unit"] = "Tonnes per annum"
            else:
                record[key + " Unit"] = None
            if record[key] not in [None, "NA"]:
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
            if record[key] not in [None, "NA"]:
                log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def manufacturers(records, **params):
    source_variables = params["source_variables"]
    org_match_index = params["org_match_index"]
    keys = [
        "Manufacturer 1",
        "Manufacturer 2",
        "Manufacturer 3",
        "Manufacturer 4",
        "Manufacturer 5",
    ]
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            record[key] = None
            if "from" in source_var.lower() and "matching plant" in source_var.lower():
                if record["Type"] == "Plant":
                    source_key = source_var.split("from")[0].strip()
                    record[key] = record[source_key]
            elif source_var not in [None, "NA"]:
                record[key] = record[source_var]
            # normalize the org name to (an) existing org(s)
            if record[key] not in [None, "NA"]:
                record[key] = __match_org_name(record[key], org_match_index)
            if record[key] not in [None, "NA"]:
                log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def contractors(records, **params):
    source_variables = params["source_variables"]
    org_match_index = params["org_match_index"]
    keys = [f"Contractor {n}" for n in range(1, 13)]  # 1..12
    for record in records:
        dataset = record["Dataset"]
        for key in keys:
            source_var = source_variables[dataset][key]
            if source_var in [None, "NA"]:
                record[key] = None
            elif "EPC Contractor from row" in source_var:
                if record["Type"] == "Plant":
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
            # normalize the org name to (an) existing org(s)
            if record[key] not in [None, "NA"]:
                record[key] = __match_org_name(record[key], org_match_index)
            if record[key] not in [None, "NA"]:
                log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def sox_reduction_system(records, **params):
    source_variables = params["source_variables"]
    keys = ["SOx Reduction System"]
    for record in records:
        dataset = record["Dataset"]
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
            if record[key] not in [None, "NA"]:
                log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def nox_reduction_system(records, **params):
    source_variables = params["source_variables"]
    keys = ["NOx Reduction System"]
    for record in records:
        dataset = record["Dataset"]
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
            if record[key] not in [None, "NA"]:
                log.debug(f"{dataset}: {key}: {record[key]}")
    return records


def total_cost_w_currency(records, **params):
    source_variables = params["source_variables"]
    key = "Total Cost"
    for record in records:
        dataset = record["Dataset"]
        source_var = (source_variables[dataset][key] or "NA").strip()
        if source_var in [None, "NA"]:
            record[key] = None
        elif source_var.startswith("CAPEX (USD)"):
            if record["CAPEX (USD)"] is not None:
                record[key] = record["CAPEX (USD)"]
            else:
                record[key] = None
        elif source_var.startswith("Capex USD"):
            if record["Capex USD"] is not None:
                record[key] = record["Capex USD"]
            else:
                record[key] = None
        elif source_var in record:
            record[key] = record[source_var]
        else:
            raise ValueError(
                f'invalid source variable: dataset="{dataset}", key="{key}", val="{source_var}"'
            )
        if record[key] not in [None, "NA"]:
            record[key] = int(round(excel.value_to_float(record[key]), 0))  # convert to integer
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
#             if record[key] not in [None, "NA"]:
#                 log.info(f"{dataset}: {key}: {record[key]}")
#     return records


if __name__ == "__main__":
    """assume that we're getting a JSON file and producing a JSON file"""
    import json, os, re, sys, openpyxl, importlib
    from datetime import datetime
    from collections import OrderedDict
    from . import data, excel

    from . import LOGGING

    logging.basicConfig(**LOGGING)

    this = importlib.import_module("power_plant_import.normalize")
    functions = sorted(
        [f for f in [eval(f) for f in dir(this) if "__" not in f] if "function" in str(f)],
        key=lambda f: str(f),
    )

    source_matrix_filename = os.path.abspath(sys.argv[1])
    json_filename = os.path.abspath(sys.argv[2])

    source_matrix = excel.load_workbook_data(source_matrix_filename)

    params = dict(
        source_variables=excel.worksheet_dict(
            source_matrix["Source - Variables Matrix"], "Dataset"
        ),
        status_conversions=excel.worksheet_dict(
            source_matrix["Status Conversions"], "Listed Status"
        ),
        countries_regions=excel.worksheet_dict(source_matrix["Country-Region Lookup"], "Countries"),
        org_match_index={
            __norm_match_name(name): name
            for name in excel.worksheet_dict(
                source_matrix["Organizations List"], "Organization Name"
            ).keys()
        },
        fuel_types=excel.worksheet_dict(
            source_matrix["Fuel Types"], "Current Fuel Type List", report=False
        ),
    )

    power_plant_data = data.read_json(json_filename)
    power_plant_data = data.reduce_power_plant_data(power_plant_data, *functions, **params)
    output_filename = os.path.join(
        os.path.dirname(json_filename),
        f"1-normalize-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json",
    )
    data.write_json(output_filename, power_plant_data)
