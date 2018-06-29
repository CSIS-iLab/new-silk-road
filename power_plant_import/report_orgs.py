"""
list the orgs in the source data, compare with the Organizations List,
do "fuzzy matching" to create potential matches.
"""

import os, re, sys
import fuzzywuzzy.fuzz
from . import excel, data


def normalize_match_name(name):
    return re.sub(r"[\W]+", " ", name).strip().lower()


def match_org(org_name, org_match_index):
    org = {"Source Name": org_name}
    match_name = normalize_match_name(org_name)

    # use "fuzzy matching"
    org_match_ratios = {
        org_index_name: fuzzywuzzy.fuzz.ratio(match_name, org_index_name)
        for org_index_name in org_match_index.keys()
    }
    best_match = max(org_match_ratios, key=org_match_ratios.get)
    org["Match Name"] = org_match_index[best_match]
    org["Match %"] = org_match_ratios[best_match]

    return org


if __name__ == "__main__":
    source_matrix_filename = sys.argv[1]
    data_filename = sys.argv[2]

    org_list = list(
        excel.worksheet_dict(
            excel.load_workbook_data(source_matrix_filename)["Organizations List"],
            "Organization Name",
            merge=False,
        ).keys()
    )
    org_match_index = {normalize_match_name(name): name for name in org_list}
    power_plant_data = data.read_json(data_filename)
    base_keys = ["Contractor", "Manufacturer", "Operator", "Owner"]

    # collect all source data org names that are not exactly represented in the Organizations List
    missing_orgs = {}
    for plant_name in power_plant_data:
        for record in power_plant_data[plant_name]:
            for base_key in base_keys:
                for field in [
                    field
                    for field in record.keys()
                    if re.match(r"^%s \d+$" % base_key, field) is not None
                    and record[field] not in [None, 'NA']
                ]:
                    for org_name in [
                        name.strip() for name in record[field].split(";") if name.strip() != ""
                    ]:
                        if org_name not in org_list and org_name not in missing_orgs:

                            missing_org = match_org(org_name, org_match_index)
                            print({**missing_org})
                            missing_orgs[org_name] = missing_org

    orgs_report_filename = os.path.join(os.path.dirname(sys.argv[1]), "orgs_matches.txt")
    with open(orgs_report_filename, "wb") as f:
        f.write(b"Source Name\tMatch %\tMatch Name\n")
        for org in sorted(missing_orgs.values(), key=lambda org: org["Match %"], reverse=True):
            f.write("{Source Name}\t{Match %}\t{Match Name}\n".format(**org).encode("UTF-8"))
