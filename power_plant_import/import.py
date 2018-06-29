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
    LOGGING["format"] = "[%(asctime)s] %(levelname)s: %(message)s"
    logging.basicConfig(**LOGGING)

    project_path = os.path.abspath(sys.argv[1])
    parent_path = os.path.dirname(project_path)
    schema_path = os.path.join(project_path, "Schema")
    source_path = os.path.join(project_path, "Source Data")
    output_path = os.path.join(project_path, "Power Plant Data")

    source_matrix_filename = os.path.join(
        schema_path, "Power Plant Data Fields- Source Matrix_Final.xlsx"
    )
    source_matrix = excel.load_workbook_data(source_matrix_filename)
    log.info(f"loaded source matrix: {os.path.relpath(source_matrix_filename, parent_path)}")

    fuel_categories_filename = os.path.join(schema_path, "Fuel Categories_Final.xlsx")
    fuel_categories = excel.load_workbook_data(fuel_categories_filename)
    log.info(f"loaded fuel categories: {os.path.relpath(fuel_categories_filename, parent_path)}")

    params = dict(
        source_variables=excel.worksheet_dict(
            source_matrix["Source - Variables Matrix"], "Dataset", report=False
        ),
        organizations=excel.worksheet_dict(
            source_matrix["Organizations List"], "Organization Name", report=False
        ),
        org_match_index={
            normalize.__norm_match_name(name): name
            for name in excel.worksheet_dict(
                source_matrix["Organizations List"], "Organization Name", report=False
            ).keys()
        },
        countries_regions=excel.worksheet_dict(
            source_matrix["Country-Region Lookup"], "Countries", report=False
        ),
        status_conversions=excel.worksheet_dict(
            source_matrix["Status Conversions"], "Listed Status", report=False
        ),
        fuel_types=excel.worksheet_dict(
            fuel_categories["Fuel Types"], "Current Fuel Type List", report=False
        ),
    )

    source_filenames = [
        fn
        for fn in glob(os.path.join(source_path, "*.*"))
        if os.path.splitext(fn)[-1].lower() in [".xslx", ".csv"]
        and os.path.basename(fn)[0] not in ["~", "#", "$"]  # no temp files
    ]
    log.info(f"0 collate {len(source_filenames)} source files in {source_path}")
    source_data = data.load_source_data(source_filenames, params["source_variables"])
    log.info(f"{len(source_data)} records in source_data")

    power_plant_data = data.collect_power_plant_data(source_data, params["source_variables"])
    log.info(f"{len(power_plant_data)} recordsets in power_plant_data")
    json_filename = os.path.join(
        output_path, f"0-collate-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    )
    with open(json_filename, "w") as f:
        json.dump(power_plant_data, f, indent=2)
    log.info(f"wrote {os.path.relpath(json_filename, parent_path)}")

    function_sets = OrderedDict()
    for mod in [normalize, remove, merge]:
        mod_name = mod.__name__.split(".")[-1]
        functions = [
            f
            for f in [eval(f"{mod.__name__.split('.')[-1]}.{f}") for f in dir(mod) if "__" not in f]
            if "function" in str(f)
        ]
        function_sets[mod_name] = sorted(functions, key=lambda f: str(f))

    mod_names = list(function_sets.keys())
    for mod_name, function_set in function_sets.items():
        log.info(f"{mod_names.index(mod_name)+1} {mod_name}")
        power_plant_data = data.reduce_power_plant_data(power_plant_data, *function_set, **params)
        json_filename = os.path.join(
            output_path,
            f"{mod_names.index(mod_name)+1}-{mod_name}-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json",
        )
        with open(json_filename, "w") as f:
            json.dump(power_plant_data, f, indent=2)
        log.info(f"wrote {os.path.relpath(json_filename, parent_path)}")
