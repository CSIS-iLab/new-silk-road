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
from infrastructure.models import Fuel, FuelCategory, Organization

# Set the logging
logger = logging.getLogger('power_plant_import')


def get_or_create_fuels(row):
    """Get or create the Fuels and FuelCategories for this row."""
    object_type = row.get('Type')
    fuels = []
    for i in range(1, 8):
        if row.get('{} Fuel {} Category'.format(object_type, i)):
            fuel_category_name = row.get('Plant Fuel {} Category'.format(i))
            fuel_category = FuelCategory.objects.get_or_create(name=fuel_category_name)
            fuel_name = row.get('{} Fuel {}'.format(object_type, i))
            fuel = Fuel.objects.get_or_create(name=fuel_name, fuel_category=fuel_category)
            fuels.append(fuel)

    return fuels


def get_or_create_organizations(row):
    """
    Get or create the Organization related to this row.

    This includes: contractors, manufacturers, consultants, implementers, and operators.
    """
    contractors = []
    for i in range(1, 11):
        if row.get('Contractor {}'.format(i)):
            contractor_name = row.get('Contractor {}'.format(i))
            contractor = Organization.objects.get_or_create(name=contractor_name)
            contractors.append(contractor)

    manufacturers = []
    for i in range(1, 6):
        if row.get('Manufacturer {}'.format(i)):
            manufacturer_name = row.get('Manufacturer {}'.format(i))
            manufacturer = Organization.objects.get_or_create(name=manufacturer_name)
            manufacturers.append(manufacturer)

    consultants = []
    if row.get('Consultant'):
        consultant_name = row.get('Consultant')
        consultant = Organization.objects.get_or_create(name=consultant_name)
        consultants.append(consultant)

    implementers = []
    if row.get('Implementing Agency'):
        implementer_name = row.get('Implementing Agency')
        implementer = Organization.objects.get_or_create(name=implementer_name)
        implementers.append(implementer)

    operators = []
    for i in range(1, 5):
        if row.get('Operator {}'.format(i)):
            operator_name = row.get('Operator {}'.format(i))
            operator = Organization.objects.get_or_create(name=operator_name)
            operators.append(operator)

    return contractors, manufacturers, consultants, implementers, operators


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
            # Here, row_number begins with 0, but in the spreadsheet, that row is
            # actually row 2 (row 1 is the header row). Use the perceived_row_number
            # when giving the user output
            perceived_row_number = row_number + 2

            # Get the object type. If this is neither a 'Plant' nor 'Project', then
            # add the row to error_rows, and move on to the next row
            object_type = row.get('Type')
            if object_type not in ['Plant', 'Project']:
                error_rows.append(perceived_row_number)
                continue

            # Get the Fuel(s) for the row
            fuels = get_or_create_fuels(row)

            # Get the contractors, manufacturers, consultants, implementers, and
            # operators for the row
            (
                contractors, manufacturers, consultants, implementers, operators
            ) = get_or_create_organizations(row)

            num_successful_imports += 1

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
