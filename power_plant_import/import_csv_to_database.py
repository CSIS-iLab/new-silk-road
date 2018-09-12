import argparse
import calendar
import csv
from distutils.util import strtobool
import django
import iso3166
import logging
import os
import sys

# Set up Django so that we can import models in this file
sys.path.append(os.environ['PWD'])
os.environ["DJANGO_SETTINGS_MODULE"] = "newsilkroad.settings"
django.setup()
from facts.models import Organization
from infrastructure.forms import PowerPlantForm, ProjectForm
from infrastructure.models import (
    Fuel, FuelCategory, InfrastructureType, Initiative, OwnerStake, PowerPlant,
    PowerPlantStatus, Project, ProjectFunding, ProjectPlantUnits, ProjectStatus
)
from locations.models import Country, GeometryStore, PointGeometry, Region

# Set the logging
logger = logging.getLogger('power_plant_import')


# A dictionary of country names that are found in Reconnecting Asia documents,
# and their ISO3166 corresponding names
iso_3166_country_name_conversion_dict = {
    "Czech Republic": "Czechia",
    "Iran": "Iran, Islamic Republic of",
    "Korea, North": "Korea, Democratic People's Republic of",
    "Korea, South": "Korea, Republic of",
    "Laos": "Lao People's Democratic Republic",
    "Macedonia": "Macedonia, the former Yugoslav Republic of",
    "Russia": "Russian Federation",
    "Syria": "Syrian Arab Republic",
    "Taiwan": "Taiwan, Province of China",
    "United Kingdom": "United Kingdom of Great Britain and Northern Ireland",
    "Vietnam": "Viet Nam",
}


def get_or_create_fuels(row):
    """Get or create the Fuels and FuelCategories for this row."""
    object_type = row.get('Type')
    fuels = []
    for i in range(1, 8):
        if value_or_none(row.get('{} Fuel {} Category'.format(object_type, i))):
            fuel_category_name = row.get('{} Fuel {} Category'.format(object_type, i))
            fuel_category, _ = FuelCategory.objects.get_or_create(name=fuel_category_name)
            fuel_name = row.get('{} Fuel {}'.format(object_type, i))
            fuel, _ = Fuel.objects.get_or_create(name=fuel_name, fuel_category=fuel_category)
            fuels.append(fuel)

    return fuels


def get_or_create_organizations(row):
    """
    Get or create the Organization related to this row.

    This includes: contractors, manufacturers, consultants, implementers, and operators.
    """
    contractors = []
    for i in range(1, 11):
        if value_or_none(row.get('Contractor {}'.format(i))):
            contractor_name = row.get('Contractor {}'.format(i))
            contractor, _ = Organization.objects.get_or_create(name=contractor_name)
            contractors.append(contractor)

    manufacturers = []
    for i in range(1, 6):
        if value_or_none(row.get('Manufacturer {}'.format(i))):
            manufacturer_name = row.get('Manufacturer {}'.format(i))
            manufacturer, _ = Organization.objects.get_or_create(name=manufacturer_name)
            manufacturers.append(manufacturer)

    consultants = []
    if value_or_none(row.get('Consultant')):
        consultant_name = row.get('Consultant')
        consultant, _ = Organization.objects.get_or_create(name=consultant_name)
        consultants.append(consultant)

    implementers = []
    if value_or_none(row.get('Implementing Agency')):
        implementer_name = row.get('Implementing Agency')
        implementer, _ = Organization.objects.get_or_create(name=implementer_name)
        implementers.append(implementer)

    operators = []
    for i in range(1, 5):
        if value_or_none(row.get('Operator {}'.format(i))):
            operator_name = row.get('Operator {}'.format(i))
            operator, _ = Organization.objects.get_or_create(name=operator_name)
            operators.append(operator)

    return contractors, manufacturers, consultants, implementers, operators


def add_owner_stakes(row, power_plant):
    """Create the Owners and OwnerStakes for this PowerPlant based on the row data."""
    for i in range(1, 11):
        if value_or_none(row.get('Owner {}'.format(i))):
            owner_name = row.get('Owner {}'.format(i))
            owner, _ = Organization.objects.get_or_create(name=owner_name)
            owner_stake, _ = OwnerStake.objects.get_or_create(
                owner=owner,
                power_plant=power_plant,
            )
            owner_stake.percent_owned = value_or_none(row.get('Owner {} Stake'.format(i)))
            owner_stake.save()


def convert_country_name_to_iso_3166_name(country_name):
    """Convert country name into its ISO 3166 form."""
    if country_name in iso_3166_country_name_conversion_dict:
        return iso_3166_country_name_conversion_dict[country_name]
    return country_name


def get_countries_and_regions(row):
    """Get or create the Country and Region objects for this row."""
    countries = []
    if value_or_none(row.get('Country')):
        # Get the ISO 3166 name for this country
        iso_3166_country_name = convert_country_name_to_iso_3166_name(row.get('Country'))
        # Get the ISO 3166 record for this country
        iso_record = iso3166.countries_by_name.get(iso_3166_country_name.upper())
        # Kosovo is not in the iso3166 library
        if not iso_record and iso_3166_country_name == 'Kosovo':
            iso_record = iso3166.Country(
                name='Kosovo',
                alpha2='XK',
                alpha3='XK',
                numeric=142,
                apolitical_name='Kosovo'
            )
        # Get or create the country. Note: use the country name from the spreadsheet,
        # and not the ISO 3166 country name.
        country, _ = Country.objects.get_or_create(
            name=row.get('Country'),
            numeric=iso_record.numeric,
            alpha_3=iso_record.alpha3
        )
        countries.append(country)

    regions = []
    if value_or_none(row.get('Region')):
        region, _ = Region.objects.get_or_create(name=row.get('Region'))
        for country in countries:
            if country not in region.countries.all():
                region.countries.add(country)
        regions.append(region)

    return countries, regions


def get_initiatives(row):
    """Get or create the Initiatives for this row."""
    initiatives = []
    if row.get('Initiative'):
        initiative, _ = Initiative.objects.get_or_create(name=row.get('Initiative'))
        initiatives.append(initiative)
    return initiatives


def get_status_integer_from_string_or_none(status_str, object_type):
    """Convert a status string into the integer that gets stored in the database."""
    if value_or_none(status_str):
        if object_type == 'Plant':
            return {value: key for key, value in PowerPlantStatus.STATUSES}[status_str]
        return {value: key for key, value in ProjectStatus.STATUSES}[status_str]


def get_unit_integer_from_string_or_none(unit_str):
    """Convert a unit string into the integer that gets stored in the database."""
    if value_or_none(unit_str):
        # Compare each of the values in uppercase, so that 'MWh', 'MWH', and 'MwH'
        # all match the same choice.
        return {value.upper(): key for key, value in ProjectPlantUnits.UNITS}[unit_str.upper()]


def get_month_integer_from_input_or_none(month_value):
    """Convert a month string or integer into an integer that gets stored in the database."""
    if value_or_none(month_value):
        # If this is an integer, then return it
        try:
            return int(month_value)
        except ValueError:
            # The month_value is not an integer, so try to get the month integer
            # for the value.
            if month_value in calendar.month_abbr:
                return {value: key for key, value in enumerate(calendar.month_abbr)}[month_value]
            elif month_value in calendar.month_name:
                return {value: key for key, value in enumerate(calendar.month_name)}[month_value]


def add_funders(row, project):
    """Create ProjectFunding objects for the Project."""
    for i in range(1, 3):
        if value_or_none(row.get('Funder {}'.format(i))):
            funding_organization, _ = Organization.objects.get_or_create(
                name=row.get('Funder {}'.format(i))
            )
            funder, _ = ProjectFunding.objects.get_or_create(
                project=project,
                amount=value_or_none(row.get('Funding Amount {}'.format(i))),
                currency=value_or_none(row.get('Funding Currency {}'.format(i))),
            )
            funder.sources.add(funding_organization)


def add_geo_data(row, object):
    """Add a relation to a GeometryStore object for the PowerPlant or Project."""
    # If the row has latitude and longitude values, then use them
    if row.get('Latitude') and row.get('Longitude'):
        point, _ = PointGeometry.objects.get_or_create(
            geom=django.contrib.gis.geos.Point(
                y=float(row.get('Latitude')),
                x=float(row.get('Longitude'))
            )
        )
        geometry_store, _ = GeometryStore.objects.get_or_create(
            label=row.get('Source Plant Name'),
            attributes={}
        )
        geometry_store.points.add(point)
    elif row.get('Type') == 'Project':
        # The row does not have latitude and longitude values. If the row is for
        # a Project, then try to get the GeometryStore from its PowerPlant
        geometry_store = getattr(object.power_plant, 'geo')
    else:
        geometry_store = None

    if geometry_store:
        object.geo = geometry_store
        object.save()


def value_or_none(value):
    """If there is a value, return it. Otherwise, return None."""
    if value:
        return value
    return None


def boolean_or_none(value):
    """If there is a value, try to convert it to a boolean. Otherwise, return none."""
    if value_or_none(value):
        return bool(strtobool(value))
    return None


def get_power_plant_data_for_form(power_plant_obj, row, infrastructure_type):
    """Return a dictionary of fields for a form, based on the row."""
    return {
        'name': power_plant_obj.name,
        'slug': django.utils.text.slugify(power_plant_obj.name),
        'latitude': value_or_none(row.get('Latitude')),
        'longitude': value_or_none(row.get('Longitude')),
        'infrastructure_type': infrastructure_type.id,
        'status': get_status_integer_from_string_or_none(row.get('Plant Status'), 'Plant'),
        'plant_day_online': value_or_none(row.get('Plant Day Online')),
        'plant_month_online': get_month_integer_from_input_or_none(
            row.get('Plant Month Online')
        ),
        'plant_year_online': value_or_none(row.get('Plant Year Online')),
        'decommissioning_day': value_or_none(row.get('Decommissioning Day')),
        'decommissioning_month': get_month_integer_from_input_or_none(
            row.get('Decommissioning Month')),
        'decommissioning_year': value_or_none(row.get('Decommissioning Year')),
        'plant_capacity': value_or_none(row.get('Plant Capacity')),
        'plant_capacity_unit': get_unit_integer_from_string_or_none(
            row.get('Plant Capacity Unit')
        ),
        'plant_output': value_or_none(row.get('Plant Output')),
        'plant_output_unit': get_unit_integer_from_string_or_none(
            row.get('Plant Output Unit')
        ),
        'plant_output_year': value_or_none(row.get('Plant Output Year')),
        'estimated_plant_output': value_or_none(row.get('Estimated Plant Output')),
        'estimated_plant_output_unit': get_unit_integer_from_string_or_none(
            row.get('Estimated Plant Output Unit')
        ),
        'plant_CO2_emissions': value_or_none(row.get('Plant CO2 Emissions')),
        'plant_CO2_emissions_unit': get_unit_integer_from_string_or_none(
            row.get('Plant CO2 Emissions Unit')
        ),
        'grid_connected': boolean_or_none(row.get('Grid Connected')),
    }


def get_project_data_for_form(project, power_plant, row, infrastructure_type):
    """Return a dictionary of fields for a form, based on the row."""
    return {
        'name': project.name,
        'slug': django.utils.text.slugify(project.name),
        'power_plant': power_plant.id,
        'infrastructure_type': infrastructure_type.id,
        'status': get_status_integer_from_string_or_none(row.get('Project Status'), 'Project'),
        'project_capacity': value_or_none(row.get('Project Capacity')),
        'project_capacity_unit': get_unit_integer_from_string_or_none(
            row.get('Project Capacity Unit')
        ),
        'project_output': value_or_none(row.get('Project Output')),
        'project_output_unit': get_unit_integer_from_string_or_none(row.get('Project Output Unit')),
        'estimated_project_output': value_or_none(row.get('Estimated Project Output')),
        'estimated_project_output_unit': get_unit_integer_from_string_or_none(
            row.get('Estimated Project Output Unit')
        ),
        'project_CO2_emissions': value_or_none(row.get('Project CO2 Emissions')),
        'project_CO2_emissions_unit': get_unit_integer_from_string_or_none(
            row.get('Project CO2 Emissions Unit')
        ),
        'nox_reduction_system': boolean_or_none(row.get('NOx Reduction System')),
        'sox_reduction_system': boolean_or_none(row.get('SOx Reduction System')),
        'total_cost': value_or_none(row.get('Total Cost')),
        'total_cost_currency': value_or_none(row.get('Total Cost Currency')),
        'start_day': value_or_none(row.get('Start Day')),
        'start_month': get_month_integer_from_input_or_none(row.get('Start Month')),
        'start_year': value_or_none(row.get('Start Year')),
        'construction_start_day': value_or_none(row.get('Construction Start Day')),
        'construction_start_month': get_month_integer_from_input_or_none(
            row.get('Construction Start Month')
        ),
        'construction_start_year': value_or_none(row.get('Construction Start Year')),
        'planned_completion_day': value_or_none(row.get('Completion Day')),
        'planned_completion_month': get_month_integer_from_input_or_none(
            row.get('Completion Month')
        ),
        'planned_completion_year': value_or_none(row.get('Completion Year')),
        'new': boolean_or_none(row.get('New Construction')),
    }


def remove_undesired_projects(project_id_list):
    """
    Remove Projects without completion date if PowerPlant has old or non-existent year online.

    Filter Projects that have ids in the project_id_list for those that have:
      - no completion date and a power plant without a plant_year_online, or
      - no completion date and a plant_year_online prior to 2006
    """
    return Project.objects.filter(
        id__in=project_id_list
    ).filter(
        planned_completion_year=None,
        planned_completion_month=None,
        planned_completion_day=None,
    ).filter(
        django.db.models.Q(power_plant__plant_year_online=None) |
        django.db.models.Q(power_plant__plant_year_online__lt=2006)
    ).delete()[1]['infrastructure.Project']


def remove_undesired_powerplants(power_plant_id_list):
    """Remove PowerPlant objects from the power_plant_id_list that have no Projects."""
    return PowerPlant.objects.filter(
        id__in=power_plant_id_list
    ).annotate(
        num_projects=django.db.models.Count('project')
    ).filter(
        num_projects=0
    ).delete()[1]['infrastructure.PowerPlant']


def import_csv_to_database(*args, **kwargs):
    """
    Import the contents of the CSV file into the database.

    Note: this function assumes the CSV file has the same columns as
    power_plant_import/tests/data/six_rows.csv.
    """
    # Get the arguments passed into the function
    parser = argparse.ArgumentParser(description='Parser')
    parser.add_argument('filename', type=str, nargs='+', help='The file to process')
    parser.add_argument('--no_output', type=str, nargs='+', help='Set to "True" to disable logging')
    parser.add_argument('--row_min', type=int, nargs='+', help='The first row to import')
    parser.add_argument('--row_max', type=int, nargs='+', help='The last row to import')
    parser.add_argument(
        '--remove_undesired_objects',
        action='store_true',
        help='Remove undesired power plants and proejcts from the import'
    )
    parsed_args = parser.parse_args(args)
    filename = parsed_args.filename[0].split('=')[1]
    use_logger = True
    if parsed_args.no_output and boolean_or_none(parsed_args.no_output[0]) is True:
        use_logger = False
    row_min = parsed_args.row_min[0] if parsed_args.row_min else 0
    row_max = parsed_args.row_max[0] if parsed_args.row_max else None
    remove_undesired_objects = parsed_args.remove_undesired_objects

    # Statistics logged to the user in the future
    num_successful_imports = 0
    error_rows = {}
    completed_but_with_warnings = {}
    # Statistics that can be used for removing objects after the import
    project_ids_imported = set()
    power_plant_ids_imported = set()

    with open(filename, 'r') as csv_file:
        reader = csv.DictReader(csv_file)
        for row_number, row in enumerate(reader):
            # Here, row_number begins with 0, but in the spreadsheet, that row is
            # actually row 2 (row 1 is the header row). Use the perceived_row_number
            # when giving the user output
            perceived_row_number = row_number + 2
            # If the user passed in specific rows, then only import those rows
            if perceived_row_number < row_min:
                continue
            if row_max and perceived_row_number > row_max:
                break

            # Get the object type. If this is neither a 'Plant' nor 'Project', then
            # add the row to error_rows, and move on to the next row
            object_type = row.get('Type')
            if object_type not in ['Plant', 'Project']:
                error_rows[perceived_row_number] = 'Invalid type of object: {}'.format(object_type)
                continue

            # Get the Fuel(s) for the row
            fuels = get_or_create_fuels(row)

            # Get the contractors, manufacturers, consultants, implementers, and
            # operators for the row
            (
                contractors, manufacturers, consultants, implementers, operators
            ) = get_or_create_organizations(row)

            # Get the Countries and Regions for the row
            try:
                countries, regions = get_countries_and_regions(row)
            except AttributeError:
                # The row doesn't have a valid country
                countries, regions = [], []
                completed_but_with_warnings[perceived_row_number] = 'Invalid country'

            # Get the Initiatives for the row
            initiatives = get_initiatives(row)

            # We will need an InfrastructureType of 'Power Plant', so either get
            # or create one
            infrastructure_type_power_plant, _ = InfrastructureType.objects.get_or_create(
                name='Powerplant',
                slug='powerplant'
            )

            # Create the object
            if object_type == 'Plant':
                # Get or create the PowerPlant
                new_object, _ = PowerPlant.objects.get_or_create(
                    name=row.get('Power Plant Name'),
                )
                power_plant_ids_imported.add(new_object.id)

                # Get the rest of the fields for the new_object
                try:
                    data = get_power_plant_data_for_form(
                        new_object,
                        row,
                        infrastructure_type_power_plant
                    )

                    form = PowerPlantForm(data, instance=new_object)

                    if form.is_valid():
                        new_object = form.save()
                    else:
                        error_rows[perceived_row_number] = form.errors.as_data()
                except KeyError as error:
                    error_rows[perceived_row_number] = [error]
                    continue

                # Add the owner stakes for the PowerPlant
                add_owner_stakes(row, new_object)
                # Add any operators to the new Power Plant
                for operator in operators:
                    new_object.operators.add(operator)
                # Add geo data to the Power Plant
                add_geo_data(row, new_object)

            else:
                # Get or create the Project
                project_name = row.get('Project Name')
                # If the CSV sheet has a project name of '(Project)', then get
                # the project's name from the 'Source Plant Name' field
                if project_name == '(Project)':
                    project_name = row.get('Source Plant Name')

                new_object, _ = Project.objects.get_or_create(name=project_name)
                project_ids_imported.add(new_object.id)
                # Get the PowerPlant for this Project
                power_plant, _ = PowerPlant.objects.get_or_create(
                    name=row.get('Source Plant Name'),
                )
                power_plant_ids_imported.add(power_plant.id)

                # Get the rest of the fields for the new_object
                try:
                    data = get_project_data_for_form(
                        new_object,
                        power_plant,
                        row,
                        infrastructure_type_power_plant
                    )
                    form = ProjectForm(data, instance=new_object)
                    if form.is_valid():
                        new_object = form.save()
                    else:
                        error_rows[perceived_row_number] = form.errors.as_data()
                except KeyError as error:
                    error_rows[perceived_row_number] = [error]
                    continue

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
                # Add the funders for the new Project
                add_funders(row, new_object)
                # Add geo data for the new Project
                add_geo_data(row, new_object)

            # Add the Countries and Regions to the new_object
            for country in countries:
                new_object.countries.add(country)
            for region in regions:
                new_object.regions.add(region)
            # Add the Fuels to the new_object
            for fuel in fuels:
                new_object.fuels.add(fuel)

            num_successful_imports += 1

    # Originally, this code was written with the assumption that the CSV would
    # be a sanitized list of Projects and PowerPlants to be imported into the
    # database. However, some of the rows in the CSV should not end up in the
    # database, so the following functions remove them from the database.
    num_projects_removed = num_powerplants_removed = 0
    if remove_undesired_objects:
        num_projects_removed = remove_undesired_projects(project_ids_imported)
        num_powerplants_removed = remove_undesired_powerplants(power_plant_ids_imported)
    num_projects_created = len(project_ids_imported) - num_projects_removed
    num_powerplants_created = len(power_plant_ids_imported) - num_powerplants_removed

    # Print the summary to the user
    if use_logger:
        logger.info(
            "\n-------------------------\n"
            "Results of import:\n"
            "{} rows successfully imported\n"
            "{} rows had an error\n"
            "{} Project objects created\n"
            "{} PowerPlant objects created\n"

            "-------------------------\n".format(
                num_successful_imports,
                len(error_rows),
                num_projects_created,
                num_powerplants_created,
            )
        )
        if error_rows:
            logger.info("Error rows:\n")
            for row_number, errors in error_rows.items():
                logger.info("    line {}: {}".format(row_number, errors))
        if completed_but_with_warnings:
            logger.info("The following rows were loaded, but with warnings:")
            for key, value in completed_but_with_warnings.items():
                logger.info('    line {}: {}'.format(key, value))
            logger.info("\n")


if __name__ == '__main__':
    import_csv_to_database(*sys.argv[1:])
