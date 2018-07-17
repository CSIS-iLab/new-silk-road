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
from infrastructure.models import (
    Fuel, FuelCategory, InfrastructureType, Initiative, Organization, OwnerStake,
    PowerPlant, Project, ProjectFunding
)
from locations.models import Country, Region

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


def get_owner_stakes(row):
    """Get or create the Owners and OwnerStakes for this row."""
    owner_stakes = []
    for i in range(1, 11):
        if row.get('Owner {}'.format(i)):
            owner_name = row.get('Owner {}'.format(i))
            owner = Organization.objects.get_or_create(name=owner_name)
            owner_stake = OwnerStake(owner=owner, stake=row.get('Owner {} Stake'.format(i)))
            owner_stakes.append(owner_stake)
    return owner_stakes


def get_countries_and_regions(row):
    """Get or create the Country and Region objects for this row."""
    countries = []
    if row.get('Country'):
        countries.append(Country.objects.get_or_create(name=row.get('Country')))

    regions = []
    if row.get('Region'):
        region = Region.objects.get_or_create(name=row.get('Region'))
        for country in countries:
            if country not in regions.countries.all():
                region.countries.add(country)
        regions.append(region)

    return countries, regions


def get_initiatives(row):
    """Get or create the Initiatives for this row."""
    initiatives = []
    if row.get('Initiative'):
        initiatives.append(Initiative.objects.get_or_create(name=row.get('Initiative')))
    return initiatives


def add_funders(row, project):
    """Create ProjectFunding objects for the Project."""
    for i in range(1, 3):
        if row.get('Funder {}'.format(i)):
            funder = ProjectFunding.objects.get_or_create(project=project)
            funder.amount = row.get('Funding Amount {}'.format(i))
            funder.currency = row.get('Funding Currency {}'.format(i))
            funder.save()


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

            # Get the owner stakes for the row
            owner_stakes = get_owner_stakes(row)

            # Get the Countries and Regions for the row
            countries, regions = get_countries_and_regions(row)

            # Get the Initiatives for the row
            initiatives = get_initiatives(row)

            # We will need an InfrastructureType of 'Power Plant', so either get
            # or create one
            infrastructure_type_power_plant = InfrastructureType.objects.get_or_create(
                name='Power Plant',
                slug='power-plant'
            )

            # Create the object
            if object_type == 'Plant':
                new_object = PowerPlant(
                    name=row.get('Power Plant Name'),
                    infrastructure_type=infrastructure_type_power_plant,
                    latitude=row.get('Latitude'),
                    longitude=row.get('Longitude'),
                    status=row.get('Plant Status'),
                    plant_day_online=row.get('Plant Day Online'),
                    plant_month_online=row.get('Plant Month Online'),
                    plant_year_online=row.get('Plant Year Online'),
                    decommissioning_day=row.get('Decommissioning Day'),
                    decommissioning_month=row.get('Decommissioning Month'),
                    decommissioning_year=row.get('Decommissioning Year'),
                    plant_capacity=row.get('Plant Capacity'),
                    plant_output=row.get('Plant Output'),
                    plant_output_year=row.get('Plant Output Year'),
                    estimated_plant_output=row.get('Estimated Plant Output'),
                    plant_CO2_emissions=row.get('Plant CO2 Emissions'),
                    grid_connected=row.get('Grid Connected'),
                )
                # Add any OwnerStakes to the new Power Plant
                for owner_stake in owner_stakes:
                    new_object.owner_stakes.add(owner_stake)
                # Add any operators to the new Power Plant
                for operator in operators:
                    new_object.operators.add(operator)

            else:
                new_object = Project(
                    name=row.get('Project Name'),
                    infrastructure_type=infrastructure_type_power_plant,
                    status=row.get('Project Status'),
                    project_capacity=row.get('Project Capacity'),
                    project_output=row.get('Project Output'),
                    estimated_project_output=row.get('Estimated Project Output'),
                    project_CO2_emissions=row.get('Project CO2 Emissions'),
                    nox_reduction_system=row.get('NOx Reduction System'),
                    sox_reduction_system=row.get('SOx Reduction System'),
                    total_cost=row.get('Total Cost'),
                    total_cost_currency=row.get('Total Cost Currency'),
                    start_day=row.get('Start Day'),
                    start_month=row.get('Start Month'),
                    start_year=row.get('Start Year'),
                    construction_start_day=row.get('Construction Start Day'),
                    construction_start_month=row.get('Construction Start Month'),
                    construction_start_year=row.get('Construction Start Year'),
                    planned_completion_day=row.get('Completion Day'),
                    planned_completion_month=row.get('Completion Month'),
                    planned_completion_year=row.get('Completion Year'),
                    new=row.get('New Construction'),

                )
                # Add any Initiatives to the new Project
                for initiative in initiatives:
                    new_object.initiatives.add(initiative)
                # Add the contractors to the new_object
                for contractor in contractors:
                    new_object.contractors.add(contractor)
                # Add any consultants to the new Project
                for consultant in consultants:
                    new_object.consultants.add(consultant)
                # Add any implementers to the new Project
                for implementer in implementers:
                    new_object.implementers.add(implementer)
                # Add any manufacturers to the new Project
                for manufacturer in manufacturers:
                    new_object.manufacturers.add(manufacturer)
                # Add any manufacturers to the new Project
                for manufacturer in manufacturers:
                    new_object.manufacturers.add(manufacturer)
                # Add the funders for the new Project
                add_funders(row, new_object)

            # Add the Countries and Regions to the new_object
            for country in countries:
                new_object.countries.add(country)
            for region in regions:
                new_object.regions.add(country)
            # Add the Fuels to the new_object
            for fuel in fuels:
                new_object.fuels.add(fuel)

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
