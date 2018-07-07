"""
Reduce power_plant_data records to one record per power plant
"""
import logging, re, json
from collections import OrderedDict
from . import excel

log = logging.getLogger(__name__)


def _00_merge_owners_stakes(records, **params):
    """Merge the values of Owner 1..N to the first "Plant" record.
    Each Owner N value should have its Owner Stake N value put in a corresponding field
    """
    # 1. collect all owners and their stakes for this recordset
    owners = OrderedDict()  # owner name as key, list of stakes as value
    for record in records:
        owner_fields = [
            field for field in record.keys() if re.match(r"^Owner \d+$", field) is not None
        ]
        for field in [field for field in owner_fields if record[field] not in [None, "", "NA"]]:
            stake = record.get(f"{field} Stake")
            for name in [name.strip() for name in record[field].split(";") if name.strip() != ""]:
                if name not in owners:
                    owners[name] = []
                if stake not in owners[name] and stake not in [None, "NA"]:
                    owners[name].append(stake)
            record[field] = None  # reducing
            if record.get(field + " Stake") is not None:
                record[field + " Stake"] = None

    # 2. put all values in the first "Plant" record
    plant_records = [record for record in records if record["Type"] == "Plant"]
    record = plant_records[0]
    for i, name in enumerate(owners.keys()):
        record[f"Owner {i+1}"] = name
        record[f"Owner {i+1} Stake"] = ";".join(owners[name])
    return records


def _01_merge_plant_project_fuels(records, **params):
    """collect all Plant Fuel N & Project Fuel N values from all records,
    along with corresponding Categories.
    (Tasks & Notes: Project Fuel N: Convert: "Redistribute  values to the Plant Fuel field 
    for any entries sharing the same lat, long or identical plant titles")
    """
    fuels = OrderedDict()
    for record in records:
        key = (record["Power Plant Name"], record["Project Name"])
        if key not in fuels:
            fuels[key] = []
        if record["Type"] == "Project":
            # put Project Fuel values also in the Plant Fuel columns for the parent plant
            plant_key = (key[0], key[0])
            if plant_key not in fuels:
                fuels[plant_key] = []

            for field in [
                field
                for field in record.keys()
                if re.match(r"^Project Fuel \d+$", field) and record[field] not in [None, "NA"]
            ]:
                fuel_vals = record[field].split(";")
                category_vals = record[field + " Category"].split(";")  # parallel (see normalize)
                plant_field = field.replace("Project", "Plant")  # duplicate to Plant
                for i in range(len(fuel_vals)):
                    fuels[key].append((fuel_vals[i], category_vals[i]))
                    fuels[plant_key].append((fuel_vals[i], category_vals[i]))
                record[field] = None  # reduce
                record[field + " Category"] = None

        else:  # Type=="Plant"
            for field in [
                field
                for field in record.keys()
                if re.match(r"^Plant Fuel \d+$", field) and record[field] not in [None, "NA"]
            ]:
                fuel_vals = record[field].split(";")
                category_vals = record[field + " Category"].split(";")  # parallel (see normalize)
                for i in range(len(fuel_vals)):
                    fuels[key].append((fuel_vals[i], category_vals[i]))
                record[field] = None  # reduce
                record[field + " Category"] = None

    # for each key, put all values in the first record with the same key
    for key in fuels:
        record = [
            record
            for record in records
            if (record["Power Plant Name"], record["Project Name"]) == key
        ][0]
        for i, fuel in enumerate(list(set(fuels[key]))):
            record[f"{record['Type']} Fuel {i+1}"] = fuel[0]
            record[f"{record['Type']} Fuel {i+1} Category"] = fuel[1]

    return records


def _02_merge_plant_output(records, **params):
    """Remove values with the lowest associated year (only keep the most recent available year's data)
    """
    plant_records = [record for record in records if record["Type"] == "Plant"]
    for record in plant_records:
        if record["Plant Output Year"] in [None, "NA"]:
            continue
        elif (
            plant_records[0]["Plant Output Year"] in [None, "NA"]
            or record["Plant Output Year"] > plant_records[0]["Plant Output Year"]
        ):
            for key in ["Plant Output", "Plant Output Unit", "Plant Output Year"]:
                plant_records[0][key], record[key] = record[key], None
        else:
            for key in ["Plant Output", "Plant Output Unit", "Plant Output Year"]:
                record[key] = None  # reduce
    return records


def _03_merge_project_outputs(records, **params):
    """Remove values with the lowest associated year (only keep the most recent available year's data)
    """
    project_records = OrderedDict()
    for record in [record for record in records if record["Type"] == "Project"]:
        project_name = record["Project Name"]
        if project_name not in project_records:
            project_records[project_name] = record

        if record["Project Output Year"] in [None, "NA"]:
            continue
        elif (
            project_records[project_name]["Project Output Year"] in [None, "NA"]
            or record["Project Output Year"] > project_records[project_name]["Project Output Year"]
        ):
            for key in ["Project Output", "Project Output Unit", "Project Output Year"]:
                project_records[project_name][key], record[key] = record[key], None
        else:
            for key in ["Project Output", "Project Output Unit", "Project Output Year"]:
                record[key] = None  # reduce

    return records


def _04_merge_plant_status(records, **params):
    """
    * 'Active' if all records are 'Active'
    * 'Partially Active' if 1+ are 'Active' or 'Partially Active' and 0 are 'NULL'
    * 'Inactive' 
    * 'NULL' == None
    """
    plant_statuses = list(set([record["Plant Status"] for record in records]))
    record0 = [record for record in records if record["Type"] == "Plant"][0]
    if "NULL" in plant_statuses or None in plant_statuses:
        record0["Plant Status"] = None
    elif plant_statuses == ["Active"]:
        record0["Plant Status"] = "Active"
    elif "Active" in plant_statuses or "Partially Active" in plant_statuses:
        record0["Plant Status"] = "Partially Active"
    # else there's also a possibility of "Inactive"
    return records


def _05_merge_organizations(records, **params):
    """
    For each set of keys that refer to organizations
    ("Contractor", "Manufacturer", "Operator"),
    separate delimited names, then remove duplicates, 
    and place all values one per column (e.g., Contractors 1..N)
    in the first record that has the same (Plant, Project) values
    """
    base_keys = ["Contractor", "Manufacturer", "Operator"]

    # 1. collate all the values for each (Plant, Project) for each base_key into one list
    projects = OrderedDict()
    for record in records:
        project_key = (record["Power Plant Name"], record["Project Name"])
        if project_key not in projects:
            projects[project_key] = OrderedDict()
            for base_key in base_keys:
                if base_key not in projects[project_key]:
                    projects[project_key][base_key] = []
                # use the fields that match this base_key
                for field in [
                    field for field in record.keys() if re.match(r"%s \d+" % base_key, field)
                ]:
                    if record[field] is not None:
                        val, record[field] = record[field], None  # moves values to one record
                        for org_name in val.split(";"):  # names are normalized
                            if org_name not in projects[project_key][base_key]:
                                projects[project_key][base_key].append(org_name)

    # 2. put all the values for a given project into the first record with that project_key
    for project_key in projects.keys():
        # put the values in the first record with the given project_key
        record = [
            record
            for record in records
            if (record["Power Plant Name"], record["Project Name"]) == project_key
        ][0]
        for base_key in projects[project_key].keys():
            vals = projects[project_key][base_key]
            # the values go, one per field, in fields numbered 1..N
            for i, val in enumerate(vals):
                record[f"{base_key} {i+1}"] = val
    return records


def _99_final_merge(records, **params):
    """the final merge:
    * merge values from later records if the first record value is None
    """
    projects = OrderedDict()
    for record in records:
        key = (record["Power Plant Name"], record["Project Name"])
        if key not in projects:
            projects[key] = record
        else:
            for field in [field for field in record]:
                if record[field] not in [None, "NA"] and projects[key].get(field) in [None, "NA"]:
                    projects[key][field], record[field] = record[field], None  # merge
                else:
                    record[field] = None
    return records


if __name__ == "__main__":
    """assume that we're getting a JSON file and producing a JSON file"""
    import json, os, re, sys, openpyxl, importlib
    from datetime import datetime
    from collections import OrderedDict
    from . import data, excel

    from . import LOGGING

    logging.basicConfig(**LOGGING)

    this = importlib.import_module("power_plant_import.merge")
    functions = [f for f in [eval(f) for f in dir(this) if "__" not in f] if "function" in str(f)]

    source_matrix_filename = os.path.abspath(sys.argv[1])
    json_filename = os.path.abspath(sys.argv[2])

    # source_matrix = excel.load_workbook_data(source_matrix_filename)

    params = dict()

    power_plant_data = data.read_json(json_filename)
    power_plant_data = data.reduce_power_plant_data(power_plant_data, *functions, **params)
    output_filename = os.path.join(
        os.path.dirname(json_filename), f"3-merge-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    )
    data.write_json(output_filename, power_plant_data)
    log.info(f"wrote {output_filename}")
