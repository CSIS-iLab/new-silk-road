"""
Implement the rules in the "Remove Clause" field of the "Tasks & Notes" worksheet
"""
import logging

log = logging.getLogger(__name__)


def remove_no_global_data(records, **params):
    """remove all records if none of them are global data (GD in dataset)"""
    gd_datasets = [ds for ds in [record["Dataset"] for record in records] if "GD" in ds]
    if len(gd_datasets) == 0:
        return []
    else:
        return records

def remove_country_not_in_lookup(records, **params):
    """if the Country is not in countries_regions, remove the record and log a warning"""
    countries_regions = params["countries_regions"]
    key = "Country"
    for record in reversed(records):
        dataset = record["Dataset"]
        plant_name = record["Power Plant Name"]
        project_name = record["Project Name"]
        val = record[key]
        if val is None or val not in countries_regions:
            records.pop(records.index(record))
            log.error(f"{dataset}:{plant_name}:{project_name}: {key}='{val}'")
    return records


def remove_years_lt_2006(records, **params):
    """if one of the key years is < 2006, remove the record"""
    from math import floor

    for key in ["Completion Year", "Decommissioning Year"]:
        for record in reversed(records):
            dataset = record["Dataset"]
            plant_name = record["Power Plant Name"]
            project_name = record["Project Name"]
            if record[key] not in [None, "NA"]:
                val = floor(float(str(record[key]).strip("</i>")))
                if val < 2006:
                    records.pop(records.index(record))
                    log.debug(f"{dataset}:{plant_name}:{project_name}: {key}={val}")
    return records


def remove_plant_capacity_lt_100_mw(records, **params):
    """if the "Plant Capacity" is < 100 MW, remove the record"""
    from math import floor

    key = "Plant Capacity"
    for record in reversed(records):
        dataset = record["Dataset"]
        plant_name = record["Power Plant Name"]
        project_name = record["Project Name"]
        if record[key] not in [None, "NA"]:
            val = floor(float(str(record[key]).strip("</i>")))
            unit = record[key + " Unit"]
            if unit == "GW":
                val *= 1000
            if val < 100:
                records.pop(records.index(record))
                log.debug(f"{dataset}:{plant_name}:{project_name}: {key}={val} {unit}")
    return records


def remove_italicized_values(records, **params):
    keys = ["Plant Day Online", "Plant Month Online", "Plant Year Online", "Total Cost"]
    for record in records:
        dataset = record["Dataset"]
        plant_name = record["Power Plant Name"]
        project_name = record["Project Name"]
        for key in keys:
            if record[key] is not None and "<i>" in str(record[key]):
                log.debug(f"{dataset}:{plant_name}:{project_name}: {key}={record[key]}")
                record[key] = None
    return records


def remove_estimated_plant_project_output(records, **params):
    """remove estimated values if non-estimated values are present"""
    keys = ["Estimated Plant Output", "Estimated Project Output"]
    for record in records:
        dataset = record["Dataset"]
        plant_name = record["Power Plant Name"]
        project_name = record["Project Name"]
        for key in keys:
            non_est_key = key.replace("Estimated ", "")
            if record.get(non_est_key) is not None:
                record[key] = None
                record[key + " Unit"] = None
    return records


if __name__ == "__main__":
    """assume that we're getting a JSON file and producing a JSON file"""
    import json, os, re, sys, openpyxl, importlib
    from datetime import datetime
    from collections import OrderedDict
    from . import data, excel

    from . import LOGGING
    logging.basicConfig(**LOGGING)

    this = importlib.import_module("power_plant_import.remove")
    functions = [f for f in [eval(f) for f in dir(this) if "__" not in f] if "function" in str(f)]

    source_matrix_filename = os.path.abspath(sys.argv[1])
    json_filename = os.path.abspath(sys.argv[2])

    source_matrix = excel.load_workbook_data(source_matrix_filename)

    params = dict(
        countries_regions=excel.worksheet_dict(source_matrix["Country-Region Lookup"], "Countries")
    )

    power_plant_data = data.read_json(json_filename)
    power_plant_data = data.reduce_power_plant_data(power_plant_data, *functions, **params)
    output_filename = os.path.join(
        os.path.dirname(json_filename), f"03-remove-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    )
    with open(output_filename, "w") as f:
        json.dump(power_plant_data, f, indent=2)
    log.info(f"wrote {output_filename}")
