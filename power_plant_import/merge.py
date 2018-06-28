"""
Reduce power_plant_data records to one record per power plant
"""
import logging, re
from . import excel

log = logging.getLogger(__name__)


def merge_organizations(records, **params):
    """
    For each set of keys that refer to organizations
    ("Contractor", "Manufacturer", "Operator"),
    separate delimited names, then remove duplicates, 
    and place all values one per column (e.g., Contractors 1..N).
    Match organization names to the Organizations List only on "word" characters 
    (not whitespace or punctuation), and use case-insensitive matching.
    """

    def name_to_match(name):
        return re.sub(r"[\W]+", " ", name).strip().lower()

    base_keys = ["Contractor", "Manufacturer", "Operator"]
    org_names = list(params["organizations"].keys())
    org_match_names = [name_to_match(name) for name in org_names]
    projects_organizations = {}
    # 1. collate all the values for each (Plant, Project) for each base_key into one list
    for record in records:
        project_key = (record["Power Plant Name"], record["Project Name"])
        if project_key not in projects_organizations:
            projects_organizations[project_key] = {}
            for base_key in base_keys:
                if base_key not in projects_organizations[project_key]:
                    projects_organizations[project_key][base_key] = []
                    # use the fields that match this base_key
                    for field in [
                        field for field in record.keys() if re.match(r"%s \d+" % base_key, field)
                    ]:
                        if record.get(field) is not None:
                            # set the record[field] to None – this is reducing!
                            val, record[field] = record[field], None
                            # split the val on semicolons
                            for name in [name.strip() for name in val.split(";")]:
                                match_name = name_to_match(name)
                                # if the name doesn't match but match_name does, normalize with warning
                                if name not in org_names and match_name in org_match_names:
                                    org_name = org_names[org_match_names.index(match_name)]
                                    log.warn(f'{project_key}: {field}: "{name}" => "{org_name}"')
                                else:
                                    org_name = name
                                # add new org_name to the list
                                if org_name not in projects_organizations[project_key][base_key]:
                                    projects_organizations[project_key][base_key].append(org_name)
    # 2. put all the values for a given project_key, base_key into the first record with that project_key
    for project_key in projects_organizations.keys():
        record = [
            record
            for record in records
            if (record["Power Plant Name"], record["Project Name"]) == project_key
        ][0]
        for base_key in projects_organizations[project_key].keys():
            vals = projects_organizations[project_key][base_key]
            for i, val in enumerate(vals):
                record[f"{base_key} {i+1}"] = val
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
    fuel_categories_filename = os.path.abspath(sys.argv[2])
    json_filename = os.path.abspath(sys.argv[3])

    source_matrix = excel.load_workbook_data(source_matrix_filename)

    params = dict(
        source_variables=excel.worksheet_dict(
            source_matrix["Source - Variables Matrix"], "Dataset"
        ),
        countries_regions=excel.worksheet_dict(source_matrix["Country-Region Lookup"], "Countries"),
        status_conversions=excel.worksheet_dict(
            source_matrix["Status Conversions"], "Listed Status"
        ),
        organizations=excel.worksheet_dict(
            source_matrix["Organizations List"], "Organization Name"
        ),
    )

    power_plant_data = data.read_json(json_filename)
    power_plant_data = data.reduce_power_plant_data(power_plant_data, *functions, **params)
    output_filename = os.path.join(
        os.path.dirname(json_filename), f"04-reduce-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    )
    with open(output_filename, "w") as f:
        json.dump(power_plant_data, f, indent=2)
    log.info(f"wrote {output_filename}")
