import os, sys, json, logging
from datetime import datetime
from glob import glob
from collections import OrderedDict
from . import excel

log = logging.getLogger(__name__)


def load_source_data(source_filenames, source_variables):
    """given a list of source filenames and a source_variables mapping, load all source_data.
    Returns a list of source data records, with the source Dataset as the first column.
    """
    source_data = []
    for source_filename in source_filenames:
        dataset = (
            " ".join(os.path.basename(source_filename).split("_")[:-1])
            .replace("GlobalData", "GD")
            .replace("AllPowerPlants", "")
            .strip()
        )
        assert dataset in source_variables.keys(), f"Dataset not in source_variables: {dataset}"
        workbook_data = excel.load_workbook_data(source_filename)
        sheet_title = list(workbook_data.keys())[0]  # first worksheet has source data
        worksheet_data = workbook_data[sheet_title]
        log.info(f"{dataset}: {sheet_title}: {len(worksheet_data)} records")
        for record in worksheet_data:
            # prepend "Dataset" to record
            record["Dataset"] = dataset
            record.move_to_end("Dataset", last=False)
            source_data.append(record)

    # put ENI and WRI at end for lowest precedence (source_data is an OrderedDict)
    for i in range(len(source_data)):
        record = source_data[i]
        if record["Dataset"] in ["ENI", "WRI"]:
            source_data.append(source_data.pop(i))

    log.info(f"{len(source_data)} source records")

    return source_data


def collect_power_plant_data(source_data, source_variables):
    """Group the data for each power plant together. Records are grouped 
    if they have the same Power Plant Name, Plant ID, or Latitude+Longitude.
    Returns an OrderedDict (key=Power Plant Name, value=list of records).

    * source_data: The list of source records created by load_source_data()
    * source_variables: variable mapping by Dataset
    """
    power_plant_data = OrderedDict()
    # lookup indexes in power_plant_data: Power Plant Name, Plant ID, and Latitude+Longitude
    plant_id_index = {}
    plant_name_index = {}
    plant_loc_index = {}
    for record in source_data:
        dataset = record["Dataset"]

        # use indexes to match/create a data_key in power_plant_data, and append
        plant_id = record.get("Plant ID")  # not in source_variables, not in all datasets
        plant_name = record[source_variables[dataset]["Power Plant Name"]]
        plant_loc = (
            record[source_variables[dataset]["Latitude"]],
            record[source_variables[dataset]["Longitude"]],
        )
        if plant_id is not None and plant_id in plant_id_index:
            data_key = plant_id_index[plant_id]
        elif plant_name in plant_name_index:
            data_key = plant_name_index[plant_name]
        elif plant_loc in plant_loc_index:
            data_key = plant_loc_index[plant_loc]
        else:
            data_key = plant_name
        if data_key not in power_plant_data:
            power_plant_data[data_key] = []
        power_plant_data[data_key].append(record)

        # update the indexes with the current record
        if plant_id is not None and plant_id not in plant_id_index:
            plant_id_index[plant_id] = data_key
        if plant_name not in plant_name_index:
            plant_name_index[plant_name] = data_key
        if plant_loc not in plant_loc_index:
            plant_loc_index[plant_loc] = data_key

    return power_plant_data


def reduce_power_plant_data(power_plant_data, *reduce_functions, **params):
    """reduce the given power plant data using the given reduce functions.
    (Use both for filtering and for merging)

    * power_plant_data: as created by collect_power_plant_data(), an OrderedDict of lists of records
    * reduce_functions: functions to apply to the power_plant_data, takes a list of records
    * **params: keyword arguments to pass to all the filter functions. source matrix data, for example

    returns the reduced power plant data
    """
    for reduce_function in reduce_functions:
        log.info(f"reduce_function: {reduce_function.__name__}")
        for key in power_plant_data:
            power_plant_data[key] = reduce_function(power_plant_data[key], **params)
    return power_plant_data


def write_power_plant_json(json_filepath, power_plant_data):
    """our own json writer for readability: one data record per line
    """
    if not os.path.exists(os.path.dirname(json_filepath)):
        os.makedirs(os.path.dirname(json_filepath))
    with open(json_filepath, "w") as jf:
        # I want one record per line, so the built-in JSON output doesn't do.
        jf.write("{\n")
        keys = list(power_plant_data.keys())
        for data_key in keys:
            jf.write(f"""  "{data_key}": [\n""")
            records = power_plant_data[data_key]
            for record in records:
                jf.write(
                    f"""    {json.dumps(record)}{records.index(record)<len(records)-1 and ',' or ''}\n"""
                )
            jf.write(f"""  ]{keys.index(data_key)<len(keys)-1 and "," or ""}\n""")
        jf.write("}\n")


if __name__ == "__main__":
    """load source matrix and source data, group records into power_plant_data, then filter & merge
    * sys.argv[1] == source matrix filepath
    * sys.argv[2:] == source filenames, or all .xlsx in "Power Plant Source Data"
    """
    logging.basicConfig(level=20)

    # load source matrix (field names, etc.)
    source_matrix_filename = os.path.abspath(sys.argv[1])
    source_matrix = excel.load_workbook_data(source_matrix_filename)
    source_variables = excel.worksheet_dict(source_matrix["Source - Variables Matrix"], "Dataset")

    # load source data
    source_filenames = [
        os.path.abspath(fn) for fn in sys.argv[2:] if os.path.basename(fn)[0] not in ["~"]
    ]
    source_data = load_source_data(source_filenames, source_variables)

    # collect all data for each Power Plant
    power_plant_data = collect_power_plant_data(source_data, source_variables)
    log.info(f"{len(power_plant_data)} power_plant recordsets in power_plant_data")

    # write the results — json output for now
    json_filepath = os.path.join(
        os.path.dirname(os.path.abspath(source_matrix_filename)),
        f"Power Plant Data/01-collate-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json",
    )
    with open(json_filepath, "w") as f:
        json.dump(power_plant_data, f, indent=2)
    # write_power_plant_json(json_filepath, power_plant_data)
    log.info(f"wrote data: {json_filepath}")
