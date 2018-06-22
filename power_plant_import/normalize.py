"""
reduce functions that normalize power_plant_data recordsets
"""

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
        ]:
            source_key = source_variables[dataset].get(key)
            # "all cases": the value to use is given in source_key before the parens
            if (
                isinstance(source_key, str)
                and re.search(r"\(.*?all cases\)", source_key, flags=re.I) is not None
            ):
                record[key] = re.sub(r"\(.*?all cases\)", "", source_key, flags=re.I).strip()
            # null values
            elif source_key in ["NA", None] or source_key not in record:
                record[key] = None
            # otherwise, the value is in the record under the source_key
            else:
                record[key] = record.get(source_key)
    return records


def region_from_country(records, **params):
    """use the Countries Regions Lookup to set the region value"""
    countries_regions = params["countries_regions"]
    for record in records:
        if record.get("Country") is None or countries_regions.get(record["Country"]) is None:
            record["Region"] = None
        else:
            record["Region"] = countries_regions[record["Country"]]["Regions"]
    return records


def plant_project_status(records, **params):
    """provide Plant and Project Status according to Source Variables matrix.
    (no Status Conversions at this point – that's a merge step)
    """
    source_variables = params["source_variables"]
    for record in records:
        dataset = record["Dataset"]
        status_key = source_variables[dataset]["Project Status"]
        plant_key = source_variables[dataset].get("Power Plant Name")
        project_key = source_variables[dataset].get("Project Name")
        if status_key in [None, "NA"]:
            record["Plant Status"] = None
            record["Project Status"] = None
        else:
            record["Project Status"] = record.get(status_key)
            if project_key is not None and record.get(plant_key) == record.get(project_key):
                record["Plant Status"] = record["Project Status"]
            else:
                record["Plant Status"] = None
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
        for key, source_key in keys.items():
            if (
                source_variables[dataset][key] in [None, "NA"]
                or record.get(source_key) is None
                or record[source_variables[dataset]["Power Plant Name"]]
                != record.get(source_variables[dataset].get("Project Name"))
            ):
                record[key] = None
            else:
                if "Month" in key:
                    record[key] = months[record[source_key]]
                else:
                    record[key] = record[source_key]
    return records


if __name__ == "__main__":
    """assume that we're getting a JSON file and producing a JSON file"""
    import json, os, re, sys, openpyxl, importlib
    from datetime import datetime
    from collections import OrderedDict
    from . import csv, excel

    this = importlib.import_module("power_plant_import.normalize")
    functions = [f for f in [eval(f) for f in dir(this) if "__" not in f] if "function" in str(f)]

    source_matrix_filename = os.path.abspath(sys.argv[1])
    json_filename = os.path.abspath(sys.argv[2])
    source_matrix = excel.load_workbook_data(source_matrix_filename)
    source_variables = excel.worksheet_dict(source_matrix["Source - Variables Matrix"], "Dataset")
    countries_regions = excel.worksheet_dict(source_matrix["Country-Region Lookup"], "Countries")
    with open(json_filename, "r") as f:
        power_plant_data = json.load(f, object_pairs_hook=OrderedDict)

    power_plant_data = csv.reduce_power_plant_data(
        power_plant_data,
        *functions,
        source_variables=source_variables,
        countries_regions=countries_regions,
    )
    output_filename = os.path.join(
        os.path.dirname(json_filename), f"{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    )
    with open(output_filename, "w") as f:
        json.dump(power_plant_data, f, indent=2)
