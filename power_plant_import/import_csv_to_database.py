import argparse
import csv
import django
import logging
import os
import sys

# Set up Django so that we can import models in this file
sys.path.append(os.environ['PWD'])
os.environ["DJANGO_SETTINGS_MODULE"] = "newsilkroad.settings"
django.setup()

# Set the logging
logger = logging.getLogger('power_plant_import')


def import_csv_to_database(*args, **kwargs):
    """
    Import the contents of the CSV file into the database.

    Note: this function assumes the CSV file has the same columns as
    power_plant_import/test_csv.csv.
    """
    # Get the arguments passed into the function
    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument('--filename', type=str, nargs='+', help='The file to process')
    parsed_args = parser.parse_args(args)
    filename = parsed_args.filename[0]

    # Statistics logged to the user in the future
    num_successful_imports = 0
    error_rows = []

    with open(filename, 'r') as csv_file:
        reader = csv.DictReader(csv_file)
        for row_number, row in enumerate(reader):
            # Is this a PowerPlant, or a Project?
            if row.get('Type') == 'Plant':
                num_successful_imports += 1
            elif row.get('Type') == 'Project':
                num_successful_imports += 1
            else:
                error_rows.append(row_number)

    # Print the summary to the user
    logger.info(
        "\n-------------------------\n"
        "Results of import:\n"
        "{} rows successfully imported\n"
        "{} rows had an error\n"
        "-------------------------\n".format(num_successful_imports, len(error_rows))
    )
    if error_rows:
        logger.info("Error rows: {}".format(error_rows))


if __name__ == '__main__':
    import_csv_to_database(*sys.argv[1:])
