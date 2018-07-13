import csv
import sys


def import_csv_to_database(*args, **kwargs):
    """
    Import the contents of the CSV file into the database.

    Note: this function assumes the CSV file has the same columns as
    power_plant_import/test_csv.csv.
    """
    filename = [arg for arg in args][0]
    with open(filename, 'r') as csv_file:
        reader = csv.DictReader(csv_file)
        for row in reader:
            print(row)


import_csv_to_database(*sys.argv[1:])
