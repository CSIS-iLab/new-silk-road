import iso3166

from django.test import TestCase

from facts.models import Organization
from facts.tests.organization_factories import OrganizationFactory
from infrastructure.models import (
    Fuel, FuelCategory, Initiative, InfrastructureType, PlantOwnerStake, PowerPlant,
    PowerPlantStatus, Project, ProjectFunding, ProjectPlantUnits, ProjectStatus,
    ProjectCapacityUnits
)
from infrastructure.tests.factories import ProjectFundingFactory
from locations.models import Country, GeometryStore, PointGeometry, Region
from locations.tests.factories import CountryFactory, RegionFactory
from .. import import_csv_to_database


class ImportCSVToDatabaseTestCase(TestCase):
    """Test case for the import_csv_to_database() function."""

    def call_command(self, filename):
        """Call the import_csv_to_database command, with no_output set to True."""
        import_csv_to_database.import_csv_to_database(
            'filename={}'.format(filename),
            '--no_output=True'
        )

    def get_created_plants(self):
        """Get the PowerPlant objects that are created during the import."""
        powerplant_ouessant = PowerPlant.objects.get(name='Ouessant Tidal Power Project')
        powerplant_ilarionas = PowerPlant.objects.get(name='Ilarionas')
        powerplant_tonstad = PowerPlant.objects.get(name='Tonstad')
        return [powerplant_ouessant, powerplant_ilarionas, powerplant_tonstad]

    def get_created_projects(self):
        """Get the Project objects that are created during the import."""
        project_ouessant1 = Project.objects.get(name='Ouessant Tidal Power Phase I')
        project_ouessant2 = Project.objects.get(name='Ouessant Tidal Power Phase II')
        project_liaoning = Project.objects.get(
            name='Liaoning Linghai China Resource Power Wind Power Wind Farm'
        )
        return [project_ouessant1, project_ouessant2, project_liaoning]

    def test_invalid_type(self):
        """Having an invalid PowerPlant/Project 'Type' throws an error."""
        self.call_command(filename='power_plant_import/tests/data/invalid_type.csv')

        # No PowerPlants or Projects were created during the test
        self.assertEqual(PowerPlant.objects.count(), 0)
        self.assertEqual(Project.objects.count(), 0)

    def test_fuels_created(self):
        """Fuels and FuelCategories are created correctly."""
        # Currently, there are no Fuels or FuelCategory objects in the database
        self.assertEqual(Fuel.objects.count(), 0)
        self.assertEqual(FuelCategory.objects.count(), 0)

        self.call_command(filename='power_plant_import/tests/data/six_rows.csv')

        # The file has the following fuels in the following fuel categories:
        #   'Ocean' category: 'Tidal', 'Wave'
        #   'Hydro' category: 'Hydro',
        #   'Wind' category: 'Wind'
        self.assertEqual(FuelCategory.objects.count(), 3)
        self.assertEqual(Fuel.objects.count(), 4)
        fuel_cat_ocean = FuelCategory.objects.get(name='Ocean')
        fuel_cat_hydro = FuelCategory.objects.get(name='Hydro')
        fuel_cat_wind = FuelCategory.objects.get(name='Wind')
        fuel_tidal = Fuel.objects.get(name='Tidal')
        fuel_wave = Fuel.objects.get(name='Wave')
        fuel_hydro = Fuel.objects.get(name='Hydro')
        fuel_wind = Fuel.objects.get(name='Wind')
        self.assertEqual(set(fuel_cat_ocean.fuel_set.all()), set([fuel_tidal, fuel_wave]))
        self.assertEqual(set(fuel_cat_hydro.fuel_set.all()), set([fuel_hydro]))
        self.assertEqual(set(fuel_cat_wind.fuel_set.all()), set([fuel_wind]))
        # Get the PowerPlants that were created during the import
        (powerplant_ouessant, powerplant_ilarionas, powerplant_tonstad) = self.get_created_plants()
        # Get the Projects that were created during the import
        (project_ouessant1, project_ouessant2, project_liaoning) = self.get_created_projects()
        # The Fuels have been assigned to the correct PowerPlants and Projects
        self.assertEqual(set(powerplant_ouessant.fuels.all()), set([fuel_tidal]))
        self.assertEqual(set(project_ouessant1.fuels.all()), set([fuel_tidal]))
        self.assertEqual(set(project_ouessant2.fuels.all()), set([fuel_wave]))
        self.assertEqual(set(powerplant_ilarionas.fuels.all()), set([fuel_hydro]))
        self.assertEqual(set(project_liaoning.fuels.all()), set([fuel_wind]))
        self.assertEqual(set(powerplant_tonstad.fuels.all()), set([fuel_wind, fuel_hydro]))

    def test_contractors_created(self):
        """Contractors (Organizations) are created correctly for Projects."""
        # Currently, there is just 1 Organization in the database, the org_existing
        OrganizationFactory(name='Existing Organization')
        self.assertEqual(Organization.objects.count(), 1)

        self.call_command(filename='power_plant_import/tests/data/six_rows.csv')

        # Get the Projects that were created during the import
        (project_ouessant1, project_ouessant2, project_liaoning) = self.get_created_projects()
        # The CSV file mentions two contractors, 1 for the project_ouessant1, and
        # 2 for the project_ouessant2
        contractor1 = Organization.objects.get(name='Contractor One')
        contractor2 = Organization.objects.get(name='Contractor Two')
        self.assertEqual(set(project_ouessant1.contractors.all()), set([contractor1]))
        self.assertEqual(
            set(project_ouessant2.contractors.all()),
            set([contractor1, contractor2])
        )
        self.assertEqual(project_liaoning.contractors.count(), 0)

    def test_manufacturers_created(self):
        """Manufacturers (Organizations) are created correctly for Projects."""
        # Currently, there is just 1 Organization in the database, the org_existing
        org_existing = OrganizationFactory(name='Existing Organization')
        self.assertEqual(Organization.objects.count(), 1)

        self.call_command(filename='power_plant_import/tests/data/six_rows.csv')

        # Get the Projects that were created during the import
        (project_ouessant1, project_ouessant2, project_liaoning) = self.get_created_projects()
        # The CSV file mentions 3 manufacturers, 1 for the project_ouessant1, and
        # 2 for project_liaoning
        manufacturer1 = Organization.objects.get(name='Manufacturer One')
        manufacturer_vestas = Organization.objects.get(name='Vestas Wind Systems A/S')
        self.assertEqual(set(project_ouessant1.manufacturers.all()), set([org_existing]))
        self.assertEqual(
            set(project_liaoning.manufacturers.all()),
            set([manufacturer1, manufacturer_vestas])
        )
        self.assertEqual(project_ouessant2.manufacturers.count(), 0)

    def test_consultants_created(self):
        """Consultants (Organizations) are created correctly for Projects."""
        # Currently, there is just 1 Organization in the database, the org_existing
        org_existing = OrganizationFactory(name='Existing Organization')
        self.assertEqual(Organization.objects.count(), 1)

        self.call_command(filename='power_plant_import/tests/data/six_rows.csv')

        # Get the Projects that were created during the import
        (project_ouessant1, project_ouessant2, project_liaoning) = self.get_created_projects()
        # The CSV file mentions 1 consultant for the project_liaoning
        self.assertEqual(set(project_liaoning.consultants.all()), set([org_existing]))
        for project in [project_ouessant1, project_ouessant2]:
            self.assertEqual(project.consultants.count(), 0)

    def test_implementers_created(self):
        """Implementers (Organizations) are created correctly for Projects."""
        # Currently, there is just 1 Organization in the database, the org_existing
        OrganizationFactory(name='Existing Organization')
        self.assertEqual(Organization.objects.count(), 1)

        self.call_command(filename='power_plant_import/tests/data/six_rows.csv')

        # Get the Projects that were created during the import
        (project_ouessant1, project_ouessant2, project_liaoning) = self.get_created_projects()
        # The CSV file mentions 1 implementer for the project_liaoning
        implmenter1 = Organization.objects.get(name='Implementer One')
        self.assertEqual(set(project_liaoning.implementers.all()), set([implmenter1]))
        for project in [project_ouessant1, project_ouessant2]:
            self.assertEqual(project.implementers.count(), 0)

    def test_operators_created(self):
        """Implementers (Organizations) are created correctly for PowerPlants."""
        # Currently, there is just 1 Organization in the database, the org_existing
        org_existing = OrganizationFactory(name='Existing Organization')
        self.assertEqual(Organization.objects.count(), 1)

        self.call_command(filename='power_plant_import/tests/data/six_rows.csv')

        # Get the PowerPlants that were created during the import
        (powerplant_ouessant, powerplant_ilarionas, powerplant_tonstad) = self.get_created_plants()
        # The CSV file mentions 2 operators for the powerplant_tonstad
        operator1 = Organization.objects.get(name='Operator One')
        self.assertEqual(set(powerplant_tonstad.operators.all()), set([operator1, org_existing]))
        for power_plant in [powerplant_ouessant, powerplant_ilarionas]:
            self.assertEqual(power_plant.operators.count(), 0)

    def test_owners_ownerstakes_created(self):
        """Owners and OwnerStakes are created correctly for PowerPlants."""
        org_existing = OrganizationFactory(name='Existing Organization')
        # Currently, there is 1 owner (Organization) and 0 OwnerStakes objects
        # in the database
        self.assertEqual(Organization.objects.count(), 1)
        self.assertEqual(PlantOwnerStake.objects.count(), 0)

        self.call_command(filename='power_plant_import/tests/data/six_rows.csv')

        # Get the PowerPlants that were created during the import
        (powerplant_ouessant, powerplant_ilarionas, powerplant_tonstad) = self.get_created_plants()
        # The OwnerStakes have been assigned to the correct PowerPlants
        self.assertEqual(PlantOwnerStake.objects.count(), 4)
        owner_sabella = Organization.objects.get(name='Sabella SAS')
        owner_ppc = Organization.objects.get(name='Public Power Corporation SA')
        owner_stake_ouessant1 = PlantOwnerStake.objects.get(
            owner=owner_sabella,
            power_plant=powerplant_ouessant
        )
        self.assertEqual(owner_stake_ouessant1.percent_owned, 50)
        owner_stake_ouessant2 = PlantOwnerStake.objects.get(
            owner=org_existing,
            power_plant=powerplant_ouessant
        )
        self.assertEqual(owner_stake_ouessant2.percent_owned, 30)
        owner_stake_ilarionas1 = PlantOwnerStake.objects.get(
            owner=owner_ppc,
            power_plant=powerplant_ilarionas
        )
        self.assertIsNone(owner_stake_ilarionas1.percent_owned)
        owner_stake_ilarionas2 = PlantOwnerStake.objects.get(
            owner=org_existing,
            power_plant=powerplant_ilarionas
        )
        self.assertIsNone(owner_stake_ilarionas2.percent_owned)
        self.assertEqual(
            set(powerplant_ouessant.plant_owner_stakes.all()),
            set([owner_stake_ouessant1, owner_stake_ouessant2])
        )
        self.assertEqual(
            set(powerplant_ilarionas.plant_owner_stakes.all()),
            set([owner_stake_ilarionas1, owner_stake_ilarionas2])
        )
        self.assertEqual(powerplant_tonstad.plant_owner_stakes.count(), 0)

    def test_initiatives_created(self):
        """Initiatives are created correctly for Projects."""
        # Currently, there are not Initiatives in the database, the org_existing
        self.assertEqual(Initiative.objects.count(), 0)

        self.call_command(filename='power_plant_import/tests/data/six_rows.csv')

        # Get the Projects that were created during the import
        (project_ouessant1, project_ouessant2, project_liaoning) = self.get_created_projects()
        # The CSV file mentions 1 initiative for the project_liaoning
        self.assertEqual(Initiative.objects.count(), 1)
        initiative1 = Initiative.objects.get(name='Initiative One')
        self.assertEqual(set(project_liaoning.initiatives.all()), set([initiative1]))
        for project in [project_ouessant1, project_ouessant2]:
            self.assertEqual(project.initiatives.count(), 0)

    def test_countries_regions_created(self):
        """Countries and Regions are created correctly."""
        country_existing = CountryFactory(
            name=iso3166.countries.get('France').name,
            numeric=iso3166.countries.get('France').numeric,
            alpha_3=iso3166.countries.get('France').alpha3,
        )
        region_existing = RegionFactory(name='Existing Region')

        self.call_command(filename='power_plant_import/tests/data/six_rows.csv')

        # Get the PowerPlants that were created during the import
        (powerplant_ouessant, powerplant_ilarionas, powerplant_tonstad) = self.get_created_plants()
        # Get the Projects that were created during the import
        (project_ouessant1, project_ouessant2, project_liaoning) = self.get_created_projects()
        # The Countries and Regions have been assigned to the correct PowerPlants and Projects
        self.assertEqual(Country.objects.count(), 4)
        self.assertEqual(Region.objects.count(), 3)
        greece = Country.objects.get(name='Greece')
        china = Country.objects.get(name='China')
        norway = Country.objects.get(name='Norway')
        mediterranean = Region.objects.get(name='Gulf and Mediterranean')
        northeast_asia = Region.objects.get(name='Northeast Asia')
        self.assertEqual(set(powerplant_ouessant.countries.all()), set([country_existing]))
        self.assertEqual(set(powerplant_ouessant.regions.all()), set([region_existing]))
        self.assertEqual(set(project_ouessant1.countries.all()), set([country_existing]))
        self.assertEqual(set(project_ouessant1.regions.all()), set([region_existing]))
        self.assertEqual(set(project_ouessant1.countries.all()), set([country_existing]))
        self.assertEqual(set(project_ouessant1.regions.all()), set([region_existing]))
        self.assertEqual(set(powerplant_ilarionas.countries.all()), set([greece]))
        self.assertEqual(set(powerplant_ilarionas.regions.all()), set([mediterranean]))
        self.assertEqual(set(project_liaoning.countries.all()), set([china]))
        self.assertEqual(set(project_liaoning.regions.all()), set([northeast_asia]))
        self.assertEqual(set(powerplant_tonstad.countries.all()), set([norway]))
        self.assertEqual(set(powerplant_tonstad.regions.all()), set([region_existing]))

    def test_unknown_countries(self):
        """Having unknown (by the iso3166 library) countries creates new ones."""
        # Currently, there are no Countries or Regions
        self.assertEqual(Country.objects.count(), 0)
        self.assertEqual(Region.objects.count(), 0)

        # Call the command with countries that are not recognized by the iso3166 library
        self.call_command(filename='power_plant_import/tests/data/unknown_countries.csv')

        # No Countries or Regions were created during the test
        self.assertEqual(Country.objects.count(), 0)
        self.assertEqual(Region.objects.count(), 0)

    def test_funders_created(self):
        """Funders are created correctly for Projects."""
        # Currently, there is 1 ProjectFunding object in the database
        org_existing = OrganizationFactory(name='Existing Organization')
        funder_existing = ProjectFundingFactory()
        funder_existing.sources.add(org_existing)
        self.assertEqual(ProjectFunding.objects.count(), 1)

        self.call_command(filename='power_plant_import/tests/data/six_rows.csv')

        # Get the Projects that were created during the import
        (project_ouessant1, project_ouessant2, project_liaoning) = self.get_created_projects()
        # The project_ouessant1 has 2 funders, and the project_ouessant2 has 1 funder.
        # The funder_existing also still exists.
        self.assertEqual(ProjectFunding.objects.count(), 4)
        self.assertEqual(project_ouessant1.funding.count(), 2)
        self.assertEqual(
            ProjectFunding.objects.filter(
                project=project_ouessant1,
                amount=100,
                currency='USD',
            ).count(),
            1
        )
        self.assertEqual(
            ProjectFunding.objects.filter(
                project=project_ouessant1,
                amount=200,
                currency='RUB',
            ).count(),
            1
        )
        self.assertEqual(project_ouessant2.funding.count(), 1)
        self.assertEqual(
            ProjectFunding.objects.filter(
                project=project_ouessant2,
                amount=None,
                currency=None,
            ).count(),
            1
        )
        self.assertEqual(project_liaoning.funding.count(), 0)
        # The org_existing is funding 3 Projects: the one for the funder_existing,
        # the project_ouessant1 and the project_ouessant2
        self.assertEqual(org_existing.projectfunding_set.count(), 3)

    def test_geo_data_created(self):
        """GeometryStore objects are created correctly for Projects."""
        # Currently, there are no GeometryStore or PointGeometry objects in the database
        self.assertEqual(GeometryStore.objects.count(), 0)
        self.assertEqual(PointGeometry.objects.count(), 0)

        self.call_command(filename='power_plant_import/tests/data/six_rows.csv')

        # Get the PowerPlants that were created during the import
        (powerplant_ouessant, powerplant_ilarionas, powerplant_tonstad) = self.get_created_plants()
        # Get the Projects that were created during the import
        (project_ouessant1, project_ouessant2, project_liaoning) = self.get_created_projects()

        # GeometryStore objects were created for:
        #  - powerplant_ouessant
        #  - powerplant_ilarionas
        #  - project_liaoning
        # The project_ouessant1 and project_ouessant2 should use
        # powerplant_ouessant's GeometryStore
        self.assertEqual(GeometryStore.objects.count(), 3)
        # PointGeometry objects were created for:
        #  - powerplant_ouessant
        #  - powerplant_ilarionas
        #  - project_liaoning
        # The project_ouessant1 and project_ouessant2 should use
        # powerplant_ouessant's PointGeometry
        self.assertEqual(PointGeometry.objects.count(), 3)
        # The powerplant_ouessant point is correct
        powerplant_ouessant_points = powerplant_ouessant.geo.points.all()
        self.assertEqual(powerplant_ouessant_points.count(), 1)
        self.assertEqual(powerplant_ouessant_points.first().geom.x, -5.11121)
        self.assertEqual(powerplant_ouessant_points.first().geom.y, 48.43754)
        # The powerplant_ilarionas point is correct
        powerplant_ilarionas_points = powerplant_ilarionas.geo.points.all()
        self.assertEqual(powerplant_ilarionas_points.count(), 1)
        self.assertEqual(powerplant_ilarionas_points.first().geom.x, 21.8039)
        self.assertEqual(powerplant_ilarionas_points.first().geom.y, 40.0966)
        # The project_liaoning gets its geodata from its latitude and longitude
        # cells
        project_liaoning_points = project_liaoning.geo.points.all()
        self.assertEqual(project_liaoning_points.count(), 1)
        self.assertEqual(project_liaoning_points.first().geom.x, 121.38065)
        self.assertEqual(project_liaoning_points.first().geom.y, 41.16469)
        # For the project_ouessant1 and project_ouessant2, the latitude and
        # longitude cells are blank, so they get their geodata from their
        # parent PowerPlant (powerplant_ouessant).
        self.assertEqual(project_ouessant1.geo, project_ouessant1.power_plant.geo)
        self.assertEqual(project_ouessant2.geo, project_ouessant2.power_plant.geo)
        # The powerplant_tonstad has no geo data
        self.assertIsNone(powerplant_tonstad.geo)

    def test_powerplants_projects_created(self):
        """
        PowerPlants and Projects are created correctly.

        Note: ForeignKey relationships are tested in other tests, so we only test
        non-ForeignKey fields here.
        """
        # Currently, there are no PowerPlant or Project objects in the database
        self.assertEqual(PowerPlant.objects.count(), 0)
        self.assertEqual(Project.objects.count(), 0)
        # There are no InfrastructureType objects in the database
        self.assertEqual(InfrastructureType.objects.count(), 0)

        self.call_command(filename='power_plant_import/tests/data/six_rows.csv')

        # The file has 3 'Plant' rows and 3 'Project' rows, but the project_liaoning
        # also gets a parent PowerPlant created for it
        self.assertEqual(PowerPlant.objects.count(), 4)
        self.assertEqual(Project.objects.count(), 3)
        # Get the PowerPlants that were created during the import
        (powerplant_ouessant, powerplant_ilarionas, powerplant_tonstad) = self.get_created_plants()
        # Get the Projects that were created during the import
        (project_ouessant1, project_ouessant2, project_liaoning) = self.get_created_projects()
        # An InfrastructureType exists for power plants
        self.assertEqual(InfrastructureType.objects.count(), 1)
        infrastructure_type_power_plant = InfrastructureType.objects.get(
            name='Powerplant',
            slug='powerplant'
        )
        # Verify the fields for project_ouessant1
        self.assertEqual(project_ouessant1.name, 'Ouessant Tidal Power Phase I')
        self.assertEqual(project_ouessant1.power_plant, powerplant_ouessant)
        self.assertEqual(project_ouessant1.infrastructure_type, infrastructure_type_power_plant)
        self.assertEqual(project_ouessant1.published, True)
        self.assertEqual(
            project_ouessant1.status,
            {value: key for key, value in ProjectStatus.STATUSES}['Suspended']
        )
        self.assertEqual(project_ouessant1.project_capacity, 0.5)
        if project_ouessant1.project_capacity_unit != '':
            self.assertEqual(
                project_ouessant1.project_capacity_unit,
                project_ouessant1.project_capacity_unit.get_project_capacity_unit_display()
            )
        self.assertEqual(project_ouessant1.project_output, 200)
        self.assertEqual(
            project_ouessant1.project_output_unit,
            {value.upper(): key for key, value in ProjectPlantUnits.UNITS}['MWH']
        )
        self.assertEqual(project_ouessant1.estimated_project_output, None)
        self.assertEqual(project_ouessant1.estimated_project_output_unit, None)
        self.assertEqual(project_ouessant1.project_CO2_emissions, 1000000)
        self.assertEqual(
            project_ouessant1.project_CO2_emissions_unit,
            {value.upper(): key for key, value in ProjectPlantUnits.UNITS}['TONNES PER ANNUM']
        )
        self.assertEqual(project_ouessant1.nox_reduction_system, False)
        self.assertEqual(project_ouessant1.sox_reduction_system, True)
        self.assertEqual(project_ouessant1.total_cost, 1)
        self.assertEqual(project_ouessant1.total_cost_currency, 'RUB')
        self.assertEqual(project_ouessant1.start_day, 1)
        self.assertEqual(project_ouessant1.start_month, 4)
        self.assertEqual(project_ouessant1.start_year, 2010)
        self.assertEqual(project_ouessant1.planned_completion_day, 1)
        self.assertEqual(project_ouessant1.planned_completion_month, 3)
        self.assertEqual(project_ouessant1.planned_completion_year, 2010)
        self.assertEqual(project_ouessant1.new, True)
        self.assertEqual(
            project_ouessant1.description,
            'This project received public co-financing from the French State and '
            'other funds from local and public administration authorities.'
        )
        # Verify the fields for powerplant_ilarionas
        self.assertEqual(powerplant_ilarionas.name, 'Ilarionas')
        self.assertEqual(powerplant_ilarionas.infrastructure_type, infrastructure_type_power_plant)
        self.assertEqual(powerplant_ilarionas.published, True)
        self.assertEqual(
            powerplant_ilarionas.status,
            {value: key for key, value in PowerPlantStatus.STATUSES}['Partially Active']
        )
        self.assertEqual(powerplant_ilarionas.plant_day_online, None)
        self.assertEqual(powerplant_ilarionas.plant_month_online, 5)
        self.assertEqual(powerplant_ilarionas.plant_year_online, 2014)
        self.assertEqual(powerplant_ilarionas.decommissioning_day, None)
        self.assertEqual(powerplant_ilarionas.decommissioning_month, None)
        self.assertEqual(powerplant_ilarionas.decommissioning_year, 2064)
        self.assertEqual(powerplant_ilarionas.plant_capacity, 154)
        self.assertEqual(
            powerplant_ilarionas.plant_capacity_unit,
            {value.upper(): key for key, value in ProjectPlantUnits.UNITS}['MW']
        )
        self.assertEqual(powerplant_ilarionas.plant_output, 1.2)
        self.assertEqual(
            powerplant_ilarionas.plant_output_unit,
            {value.upper(): key for key, value in ProjectPlantUnits.UNITS}['MW']
        )
        self.assertEqual(powerplant_ilarionas.plant_output_year, 2016)
        self.assertEqual(powerplant_ilarionas.estimated_plant_output, 330000.5)
        self.assertEqual(
            powerplant_ilarionas.estimated_plant_output_unit,
            {value.upper(): key for key, value in ProjectPlantUnits.UNITS}['MWH']
        )
        self.assertEqual(powerplant_ilarionas.plant_CO2_emissions, 1)
        self.assertEqual(
            powerplant_ilarionas.plant_CO2_emissions_unit,
            {value.upper(): key for key, value in ProjectPlantUnits.UNITS}['TONNES PER ANNUM']
        )
        self.assertEqual(powerplant_ilarionas.grid_connected, None)
        self.assertEqual(
            powerplant_ilarionas.description,
            'METKA is a EPC contractor of the project. METKA has awarded a contract '
            'to Alstom Hydro to supply turbine-generators.'
        )
        # The project_liaoning has a value of '(Project)' in the 'Project Name'
        # field in the CSV, so project_liaoning should get its name from the
        # 'Source Plant Name' field instead.
        self.assertEqual(
            project_liaoning.name,
            'Liaoning Linghai China Resource Power Wind Power Wind Farm'
        )

    def test_multiple_import(self):
        """A user can run the import multiple times without errors or duplicate objects."""
        # Currently, there are no PowerPlant or Project objects in the database
        self.assertEqual(PowerPlant.objects.count(), 0)
        self.assertEqual(Project.objects.count(), 0)
        # There are no InfrastructureType objects in the database
        self.assertEqual(InfrastructureType.objects.count(), 0)
        # There are no Fuel or FuelCategory objects in the database
        self.assertEqual(Fuel.objects.count(), 0)
        self.assertEqual(FuelCategory.objects.count(), 0)
        # There are no Countries or Regions in the database
        self.assertEqual(Country.objects.count(), 0)
        self.assertEqual(Region.objects.count(), 0)
        # There are no OwnerStakes in the database
        self.assertEqual(PlantOwnerStake.objects.count(), 0)
        # There are no Initiatives in the database
        self.assertEqual(Initiative.objects.count(), 0)
        # There are no ProjectFunding objects in the database
        self.assertEqual(ProjectFunding.objects.count(), 0)

        # Run the import
        self.call_command(filename='power_plant_import/tests/data/six_rows.csv')

        # The file has 3 'Plant' rows and 3 'Project' rows, but the project_liaoning
        # also gets a parent PowerPlant created for it
        self.assertEqual(PowerPlant.objects.count(), 4)
        self.assertEqual(Project.objects.count(), 3)
        # There is now 1 InfrastructureType object in the database
        self.assertEqual(InfrastructureType.objects.count(), 1)
        # There are now 4 Fuel and 3 FuelCategory objects in the database
        self.assertEqual(Fuel.objects.count(), 4)
        self.assertEqual(FuelCategory.objects.count(), 3)
        # There are now 4 Countries and 3 Regions in the database
        self.assertEqual(Country.objects.count(), 4)
        self.assertEqual(Region.objects.count(), 3)
        # There are now 4 OwnerStakes in the database
        self.assertEqual(PlantOwnerStake.objects.count(), 4)
        # There is now Initiative in the database
        self.assertEqual(Initiative.objects.count(), 1)
        # There are now 3 ProjectFunding objects in the database
        self.assertEqual(ProjectFunding.objects.count(), 3)

        # Run the import again
        self.call_command(filename='power_plant_import/tests/data/six_rows.csv')

        # There are still 4 PowerPlant and 3 Project objects in the database
        self.assertEqual(PowerPlant.objects.count(), 4)
        self.assertEqual(Project.objects.count(), 3)
        # There is still 1 InfrastructureType object in the database
        self.assertEqual(InfrastructureType.objects.count(), 1)
        # There are still 4 Fuel and 3 FuelCategory objects in the database
        self.assertEqual(Fuel.objects.count(), 4)
        self.assertEqual(FuelCategory.objects.count(), 3)
        # There are still 4 Countries and 3 Regions in the database
        self.assertEqual(Country.objects.count(), 4)
        self.assertEqual(Region.objects.count(), 3)
        # There are still 4 OwnerStakes in the database
        self.assertEqual(PlantOwnerStake.objects.count(), 4)
        # There is still Initiative in the database
        self.assertEqual(Initiative.objects.count(), 1)
        # There are still 3 ProjectFunding objects in the database
        self.assertEqual(ProjectFunding.objects.count(), 3)

    def test_invlaid_data(self):
        """Rows with invalid data do not create PowerPlants or Projects."""
        # Currently, there are no PowerPlant or Project objects in the database
        self.assertEqual(PowerPlant.objects.count(), 0)
        self.assertEqual(Project.objects.count(), 0)

        # Call the command with invalid data.
        # The first row is for a power plant, but it has an invalid latitude.
        # The second row is for a project, but it has an invalid project capacity.
        # The third row is for a project, but it has an invalid project capacity unit.
        # The fourth row is for a power plant, but  has an invalid status.
        self.call_command(filename='power_plant_import/tests/data/invalid_data.csv')

        # Each of the objects were created, though the invalid data was not saved.
        self.assertEqual(PowerPlant.objects.count(), 3)
        self.assertEqual(Project.objects.count(), 2)

    def test_remove_undesired_objects(self):
        """
        Undesired objects are removed, if argument is specified.

        Projects are removed in either of the following cases:
         - If a Project has no completion date (no planned_completion_day,
           planned_completion_month, or planned_completion_year) and the associated
           PowerPlant has no plant_year_online.
         - If a Project has no completion date (no planned_completion_day,
           planned_completion_month, or planned_completion_year) and the associated
           PowerPlant has a plant_year_online prior to 2006.
        """
        with self.subTest('argument not specified'):
            # Calling the command without the --remove_undesired_objects argument
            # creates a Project for each of the project rows in the CSV, and a
            # PowerPlant for each of the power plant rows in the CSV, as well as
            # a PowerPlant for the project_liaoning, which didn't have a power plant
            # row in the CSV file associated with it.
            self.call_command(filename='power_plant_import/tests/data/six_rows.csv')
            # There are now 3 Projects and 4 PowerPlants in the database
            self.assertEqual(Project.objects.count(), 3)
            self.assertEqual(PowerPlant.objects.count(), 4)

        with self.subTest('argument specified'):
            # Calling the command with the --remove_undesired_objects argument
            # means only those Projects that meet the conditions defined above
            # end up in the database.
            import_csv_to_database.import_csv_to_database(
                'filename=power_plant_import/tests/data/six_rows.csv',
                '--no_output=True',
                '--remove_undesired_objects',
            )
            # There is now 1 Project in the database. There are 3 project rows
            # in the CSV file, but:
            #   - the project_liaoning has no completion date, and a power plant
            #     with no plant_year_online, and
            #   - the project_ouessant2 has no completion date, and a power plant
            #     with a plant_year_online from before 2006
            self.assertEqual(Project.objects.count(), 1)
            self.assertEqual(Project.objects.first().name, 'Ouessant Tidal Power Phase I')
            # There is now 1 PowerPlant in the database. There are 3 power plant
            # rows in the CSV file, and 1 more PowerPlant is needed for the
            # project_liaoning (for a total of 4 PowerPlants), but:
            #   - the powerplant_ilarionas has no associated Project in the CSV
            #   - the powerplant for the project_liaoning has not associated Project
            #     because the project_liaoning was removed above
            #   - the powerplant_tonstad has no associated Project in the CSV
            self.assertEqual(PowerPlant.objects.count(), 1)
            self.assertEqual(PowerPlant.objects.first().name, 'Ouessant Tidal Power Project')
