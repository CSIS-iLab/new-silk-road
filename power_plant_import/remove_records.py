"""
Implement the rules in the "Remove Clause" field of the "Tasks & Notes" worksheet
"""


def remove_no_global_data(records, **params):
    """remove all records if none of them are global data (GD in dataset)"""
    datasets = [ds for ds in [record["Dataset"] for record in records] if "GD " in ds]
    if len(datasets) == 0:
        return []
    else:
        return records


def remove_country_not_in_lookup(records, source_variables=None, countries_regions=None, **params):
    """if the Country is not in countries_regions, remove the record"""
    assert source_variables is not None
    assert countries_regions is not None
    for record in reversed(records):
        dataset = record["Dataset"]
        key = source_variables[dataset]["Country"]
        val = record.get(key)
        if val is None or val not in countries_regions:
            records.pop(records.index(record))
    return records


def remove_years_lt_2006(records, source_variables=None, **params):
    """if one of the key years is < 2006, remove the record"""
    from math import floor

    assert source_variables is not None
    for attrib in ["Completion Year", "Decommissioning Year"]:
        for record in reversed(records):
            dataset = record["Dataset"]
            key = source_variables[dataset][attrib]
            if record.get(key) is not None:
                val = floor(float(str(record[key]).strip("</i>")))
                if val < 2006:
                    records.pop(records.index(record))
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
        remove_no_global_data,
        remove_country_not_in_lookup,
        remove_years_lt_2006,
        source_variables=source_variables,
        countries_regions=countries_regions,
    )
    output_filename = os.path.join(
        os.path.dirname(json_filename), f"{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    )
    with open(output_filename, "w") as f:
        json.dump(power_plant_data, f, indent=2)
