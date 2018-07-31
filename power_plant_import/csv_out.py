"""
given a source data .json file, write an output tab-delimited .txt of all Power Plant and Project data.
"""
import os, sys
from datetime import datetime
from . import data
from .fields import FIELDS


def pipe_delimited_data_lines(power_plant_data, fields=FIELDS):
    """produce pipe_delimited data, including a header row, from the power_plant_data
    """
    yield '|'.join(fields)+'\n'  # header row
    for key in power_plant_data:
        for record in [r for r in power_plant_data[key] if r["Type"] == "Plant"]:
            yield "|".join([str(record.get(field) or '') for field in fields])+'\n'
        for record in [r for r in power_plant_data[key] if r["Type"] == "Project"]:
            yield "|".join([str(record.get(field) or '') for field in fields])+'\n'


def write_pipe_delimited(power_plant_data, output_path):
    output_filename = os.path.join(
        output_path, f"Plants_and_Projects-{datetime.now().strftime('%Y%m%d-%H%M%S')}.txt"
    )
    with open(output_filename, 'wb') as f:
        for line in pipe_delimited_data_lines(power_plant_data):
            f.write(line.encode('utf-8'))
    return output_filename


if __name__ == '__main__':
    json_filename = os.path.abspath(sys.argv[1])
    power_plant_data = data.read_json(json_filename)
    output_filename = write_pipe_delimited(power_plant_data, os.path.dirname(json_filename))
    print('wrote', output_filename)
