"""
Reduce power_plant_data records to one record per power plant
"""
import logging
from . import excel

log = logging.getLogger(__name__)

if __name__ == "__main__":
    """assume that we're getting a JSON file and producing a JSON file"""
    import json, os, re, sys, openpyxl, importlib
    from datetime import datetime
    from collections import OrderedDict
    from . import data, excel

    logging.basicConfig(level=20)

    this = importlib.import_module("power_plant_import.normalize")
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
        status_conversions=excel.worksheet_dict(source_matrix["Status Conversions"], "Listed Status")
    )

    power_plant_data = data.read_json(json_filename)
    power_plant_data = data.reduce_power_plant_data(power_plant_data, *functions, **params)
    output_filename = os.path.join(
        os.path.dirname(json_filename), f"04-reduce-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    )
    with open(output_filename, "w") as f:
        json.dump(power_plant_data, f, indent=2)
