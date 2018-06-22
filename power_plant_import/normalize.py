"""
reduce functions that normalize power_plant_data recordsets
"""


def field_names_from_matrix(records, source_variables=None, **params):
    """for fields where the field name is variable among sources,
    set the record field based on the source matrix (key mapping by dataset))
    """
    assert source_variables is not None
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


def region_from_country(records, countries_regions=None, **params):
    """use the Countries Regions Lookup to set the region value"""
    assert countries_regions is not None
    for record in records:
        if record.get("Country") is None or countries_regions.get(record["Country"]) is None:
            record["Region"] = None
        else:
            record["Region"] = countries_regions[record["Country"]]["Regions"]
    return records


def plant_project_status(records, source_variables=None, status_conversions=None, **params):
    """provide Plant and Project Status according to Source Variables matrix.
    (no Status Conversions at this point – that's a merge step)
    """
    assert source_variables is not None
    assert status_conversions is not None
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


if __name__ == "__main__":
    """assume that we're getting a JSON file and producing a JSON file"""
    import json, os, re, sys, openpyxl
    from datetime import datetime
    from collections import OrderedDict
    from . import csv, excel

    source_matrix_filename = os.path.abspath(sys.argv[1])
    json_filename = os.path.abspath(sys.argv[2])
    source_matrix = excel.load_workbook_data(source_matrix_filename)
    source_variables = excel.worksheet_dict(source_matrix["Source - Variables Matrix"], "Dataset")
    countries_regions = excel.worksheet_dict(source_matrix["Country-Region Lookup"], "Countries")
    with open(json_filename, "r") as f:
        power_plant_data = json.load(f, object_pairs_hook=OrderedDict)
    power_plant_data = csv.reduce_power_plant_data(
        power_plant_data,
        field_names_from_matrix,
        region_from_country,
        plant_project_status,
        source_variables=source_variables,
        countries_regions=countries_regions,
    )
    output_filename = os.path.join(
        os.path.dirname(json_filename), f"{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    )
    with open(output_filename, "w") as f:
        json.dump(power_plant_data, f, indent=2)
