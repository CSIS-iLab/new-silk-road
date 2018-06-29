"""
import the source data, running the entire process in stages
"""
import logging, os, sys, json
from datetime import datetime
from glob import glob
from collections import OrderedDict
from . import excel, data, normalize, remove, merge, LOGGING

log = logging.getLogger("import")

if __name__ == "__main__":
    logging.basicConfig(**LOGGING)

    project_path = os.path.abspath(sys.argv[1])
    schema_path = os.path.join(project_path, "Schema")
    source_path = os.path.join(project_path, "Source Data")
    output_path = os.path.join(project_path, "Power Plant Data")

    source_matrix = excel.load_workbook_data(
        os.path.join(schema_path, "Power Plant Data Fields- Source Matrix_Final.xlsx")
    )
    log.info("loaded source matrix")
    fuel_categories = excel.load_workbook_data(
        os.path.join(schema_path, "Fuel Categories_Final.xlsx")
    )
    log.info("loaded fuel categories")
    params = dict(
        source_variables=excel.worksheet_dict(
            source_matrix["Source - Variables Matrix"], "Dataset"
        ),
        organizations=excel.worksheet_dict(
            source_matrix["Organizations List"], "Organization Name"
        ),
        org_match_index={
            normalize.__norm_match_name(name): name
            for name in excel.worksheet_dict(
                source_matrix["Organizations List"], "Organization Name"
            ).keys()
        },
        status_conversions=excel.worksheet_dict(
            source_matrix["Status Conversions"], "Listed Status"
        ),
        fuel_types=excel.worksheet_dict(fuel_categories["Fuel Types"], "Current Fuel Type List"),
    )

    source_filenames = [
        fn
        for fn in glob(os.path.join(source_path, "*.*"))
        if os.path.splitext(fn)[-1].lower() in [".xslx", ".csv"]
        and os.path.basename(fn)[0] not in ["~", "#", "$"]  # no temp files
    ]
    log.info("0 collate")
    source_data = data.load_source_data(source_filenames, params["source_variables"])
    log.info(f"{len(source_data)} records in source_data")

    power_plant_data = data.collect_power_plant_data(source_data, params["source_variables"])
    log.info(f"{len(power_plant_data)} recordsets in power_plant_data")
    json_filename = os.path.join(
        output_path, f"{datetime.now().strftime('%Y%m%d-%H%M%S')}-0-collate.json"
    )
    with open(json_filename, "w") as f:
        json.dump(power_plant_data, f, indent=2)
    log.info(f"wrote {json_filename}")

    function_sets = OrderedDict()
    for mod in [normalize, remove, merge]:
        mod_name = mod.__name__.split(".")[-1]
        functions = [
            f for f in [
                eval(f"{mod.__name__.split('.')[-1]}.{f}") 
                for f in dir(mod) if "__" not in f
            ] if "function" in str(f)
        ]
        function_sets[mod_name] = sorted(functions, key=lambda f: str(f))

    mod_names = list(function_sets.keys())
    for mod_name, function_set in function_sets.items():
        log.info(f"{mod_names.index(mod_name)+1} {mod_name}")
        power_plant_data = data.reduce_power_plant_data(power_plant_data, *function_set, **params)
        json_filename = os.path.join(
            output_path,
            f"{datetime.now().strftime('%Y%m%d-%H%M%S')}-{mod_names.index(mod_name)+1}-{mod_name}.json",
        )
        with open(json_filename, "w") as f:
            json.dump(power_plant_data, f, indent=2)
        log.info(f"wrote {json_filename}")
