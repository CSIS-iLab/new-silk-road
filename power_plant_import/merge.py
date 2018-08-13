"""
Reduce power_plant_data records to one record per power plant
"""
import logging, re, json
from datetime import datetime
from collections import OrderedDict
from . import excel

log = logging.getLogger(__name__)


def _00_merge_owners_stakes(records, **params):
    """Merge the values of Owner 1..N to the first project record.
    Each Owner N value should have its Owner Stake N value put in a corresponding field
    """
    # 1. collect all owners and their stakes for this recordset
    owners = OrderedDict()  # project as key, ordered dict of owner: stake
    for record in records:
        project_key = (record["Power Plant Name"], record["Project Name"])
        if project_key not in owners:
            owners[project_key] = OrderedDict()  #  owners names as keys, list of stakes as values
        owner_fields = [
            field for field in record.keys() if re.match(r"^Owner \d+$", field) is not None
        ]
        for field in [field for field in owner_fields if record[field] not in [None, "", "NA"]]:
            stake = record.get(f"{field} Stake")
            for name in [name.strip() for name in record[field].split(";") if name.strip() != ""]:
                if name not in owners[project_key]:
                    owners[project_key][name] = []
                if stake not in owners[project_key][name] and stake not in [None, "NA"]:
                    owners[project_key][name].append(stake)
            # reducing
            record[field] = None
            if record.get(field + " Stake") is not None:
                record[field + " Stake"] = None

    # 2. put all values for each plant/project in the first record for that plant/project
    for project_key in owners.keys():
        record = [
            record
            for record in records
            if (record["Power Plant Name"], record["Project Name"]) == project_key
        ][0]
        for i, name in enumerate(owners[project_key].keys()):
            record[f"Owner {i+1}"] = name
            record[f"Owner {i+1} Stake"] = ";".join(owners[project_key][name])
    return records


def _01_merge_plant_project_fuels(records, **params):
    """collect all Plant Fuel N & Project Fuel N values from all records,
    along with corresponding Categories.
    (Tasks & Notes: Project Fuel N: Convert: "Redistribute  values to the Plant Fuel field 
    for any entries sharing the same lat, long or identical plant titles")
    """
    fuels = OrderedDict()
    for record in records:
        project_key = (record["Power Plant Name"], record["Project Name"])
        if project_key not in fuels:
            fuels[project_key] = []
        if record["Type"] == "Project":
            # put Project Fuel values also in the Plant Fuel columns for the parent plant
            plant_key = (project_key[0], project_key[0])
            if plant_key not in fuels:
                fuels[plant_key] = []

            for field in [
                field
                for field in record
                if re.match(r"^Project Fuel \d+$", field) and record[field] not in [None, "NA"]
            ]:
                fuel_vals = record[field].split(";")
                category_vals = record[field + " Category"].split(";")  # parallel (see normalize)
                plant_field = field.replace("Project", "Plant")  # duplicate to Plant
                for i in range(len(fuel_vals)):
                    fuels[project_key].append((fuel_vals[i], category_vals[i]))
                    fuels[plant_key].append((fuel_vals[i], category_vals[i]))
                record[field] = None  # reduce
                record[field + " Category"] = None

            # remove "Plant Fuel" values from Projects
            for field in [
                field for field in record if re.match(r"^Plant Fuel \d+( Category)?$", field)
            ]:
                record[field] = None

        elif project_key[0] == project_key[1]:  # Type=="Plant"
            for field in [
                field
                for field in record
                if re.match(r"^Plant Fuel \d+$", field) and record[field] not in [None, "NA"]
            ]:
                fuel_vals = record[field].split(";")
                category_vals = record[field + " Category"].split(";")  # parallel (see normalize)
                try:
                    for i in range(len(fuel_vals)):
                        fuels[project_key].append((fuel_vals[i], category_vals[i]))
                except:
                    print(fuel_vals, '\n\n', category_vals)
                    raise
                record[field] = None  # reduce
                record[field + " Category"] = None

            # remove "Project Fuel" values from Plants
            for field in [
                field for field in record if re.match(r"^Project Fuel \d+( Category)?$", field)
            ]:
                record[field] = None

    # for each project_key, put all values in the first record with the same project_key
    for project_key in fuels:
        project_records = [
            record
            for record in records
            if (record["Power Plant Name"], record["Project Name"]) == project_key
        ]
        if len(project_records) > 0:
            project_record = project_records[0]
            for i, fuel in enumerate(list(set(fuels[project_key]))):
                project_record[f"{project_record['Type']} Fuel {i+1}"] = fuel[0]
                project_record[f"{project_record['Type']} Fuel {i+1} Category"] = fuel[1]

    return records


def _02_merge_plant_project_outputs(records, **params):
    """Remove values with the lowest associated year (only keep the most recent available year's data)
    """
    output_records = OrderedDict()
    for record in records:
        project_key = (record["Power Plant Name"], record["Project Name"])
        if project_key not in output_records:
            output_records[project_key] = record

        base_field = f"{record['Type']} Output"
        if record.get(f"{base_field} Year") in [None, "NA"]:
            continue
        elif (
            output_records[project_key][f"{base_field} Year"] in [None, "NA"]
            or record[f"{base_field} Year"] > output_records[project_key][f"{base_field} Year"]
        ):
            for key in [f"{base_field}", f"{base_field} Unit", f"{base_field} Year"]:
                output_records[project_key][key], record[key] = record[key], None
        else:
            for key in [f"{base_field}", f"{base_field} Unit", f"{base_field} Year"]:
                record[key] = None  # reduce

    return records


def _04_merge_plant_status(records, **params):
    """
    * 'Active' if all records are 'Active'
    * 'Partially Active' if 1+ are 'Active' or 'Partially Active' and 0 are 'NULL'
    * 'Inactive' 
    * 'NULL'
    """
    plant_names = list(set([record["Power Plant Name"] for record in records]))
    for plant_name in plant_names:
        plant_records = [record for record in records if record["Power Plant Name"]==plant_name]
        plant_statuses = list(set([record["Plant Status"] for record in plant_records]))
        record0 = [record for record in plant_records][0]
        if "NULL" in plant_statuses:
            record0["Plant Status"] = "NULL"
        elif plant_statuses == ["Active"]:
            record0["Plant Status"] = "Active"
        elif "Active" in plant_statuses or "Partially Active" in plant_statuses:
            record0["Plant Status"] = "Partially Active"
        # else there's also a possibility of "Inactive"
        for record in [record for record in records if record != record0]:
            record["Plant Status"] = None
    return records


def _05_merge_organizations(records, **params):
    """
    For each set of keys that refer to organizations
    ("Contractor", "Manufacturer", "Operator"),
    separate delimited names, then remove duplicates, 
    and place all values one per column (e.g., Contractors 1..N)
    in the first record that has the same (Plant, Project) values
    """
    base_fields = ["Contractor", "Manufacturer", "Operator"]

    # 1. collate all the values for each (Plant, Project) for each base_field into one list
    projects = OrderedDict()
    for record in records:
        key = (record["Power Plant Name"], record["Project Name"])
        if key not in projects:
            projects[key] = OrderedDict()
        for base_field in base_fields:
            if base_field not in projects[key]:
                projects[key][base_field] = []
            # use the fields that match this base_field
            for field in [
                field for field in record.keys() if re.match(r"^%s \d+$" % base_field, field)
            ]:
                if record[field] is not None:
                    val, record[field] = record[field], None  # moves values to one record
                    for org_name in val.split(";"):  # names are normalized
                        if org_name not in projects[key][base_field]:
                            projects[key][base_field].append(org_name)

    # 2. put all the values for a given project into the first record with that project_key
    for key in projects.keys():
        # put the values in the first record with the given project key
        record = [
            record
            for record in records
            if (record["Power Plant Name"], record["Project Name"]) == key
        ][0]
        for field in projects[key].keys():
            vals = projects[key][field]
            # the values go, one per field, in fields numbered 1..N
            for i, val in enumerate(vals):
                record[f"{field} {i+1}"] = val
    return records


def __print_field_conflict(project, record, field):
    print(
        '|'.join(
            [project["Power Plant Name"], project["Project Name"]]
            + [field, str(project[field]), str(record[field])]
            + [project['Dataset'], record['Dataset']]
        )
    )


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
            # merge everything except the Dataset
            for field in [field for field in record if field != 'Dataset']:
                if record[field] not in [None, "NA"]:
                    if projects[key].get(field) in [None, "NA"]:
                        projects[key][field] = record[field]
                    project = projects[key]
                    if record[field] != project[field]:
                    # GD takes precedence over WRI always
                        if 'WRI' in record['Dataset'] and 'GD' in project['Dataset']:
                        pass
                        elif 'GD' in record['Dataset'] and 'WRI' in project['Dataset']:
                            project[field] = record[field]
                    elif field == "Source Plant Name":
                            if record[field].lower() != project[field].lower():  # norm case
                                __print_field_conflict(project, record, field)
                    elif field in ["Latitude", "Longitude"]:  # fuzzy match: 2 decimal places
                            if round(float(record[field]), 2) != round(float(project[field]), 2):
                                __print_field_conflict(project, record, field)
                    elif field in ["Estimated Plant Output", "Estimated Project Output"]:
                        # prioritize GD values over non-GD values
                            if "GD" not in project["Dataset"] and "GD" in record["Dataset"]:
                                project[field] = record[field]
                            elif ("GD" in project["Dataset"] and "GD" in record["Dataset"]) or (
                                "GD" not in project["Dataset"] and "GD" not in record["Dataset"]
                        ):
                                __print_field_conflict(project, record, field)
                        else:  # "GD" in project[key]["Dataset"] and not in record["Dataset"]
                            pass
                        else:
                            __print_field_conflict(project, record, field)
            # merge Datasets -- semicolon-delimited string
            if record["Dataset"] not in project["Dataset"]:
                project["Dataset"] += ";" + record["Dataset"]
    return list(projects.values())


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
    print("Power Plant Name|Project Name|Conflict Field|Value1|Value2|Dataset1|Dataset2")
    power_plant_data = data.reduce_power_plant_data(power_plant_data, *functions, **params)
    output_filename = os.path.join(
        os.path.dirname(json_filename), f"3-merge-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    )
    data.write_json(output_filename, power_plant_data)
    log.info(f"wrote {output_filename}")
