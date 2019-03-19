import csv
import io
import json
import os
import tempfile

from django.conf import settings
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.test import TestCase
from django.urls import reverse

from facts.tests.organization_factories import OrganizationFactory
from infrastructure.export import refresh_views
from locations.models import GeometryStore
from locations.tests.factories import CountryFactory, RegionFactory
from publish.tests.factories import UserFactory
from . import factories


class ProjectDetailViewTestCase(TestCase):
    """Render the details for a project."""

    def setUp(self):
        super().setUp()
        self.project = factories.ProjectFactory(published=True)

    def test_get_project(self):
        """Fetch the project detail page."""

        with self.assertTemplateUsed('infrastructure/project_detail.html'):
            response = self.client.get(self.project.get_absolute_url())
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, self.project.name)

    def test_unpublished_project(self):
        """You should not be able to view unpublished projects."""

        self.project.published = False
        self.project.save()

        response = self.client.get(self.project.get_absolute_url())
        self.assertEqual(response.status_code, 404)

    def test_map_context(self):
        """Mapbox configuration should be in the template."""

        response = self.client.get(self.project.get_absolute_url())
        self.assertEqual(response.context['mapbox_token'], settings.MAPBOX_TOKEN)
        self.assertEqual(response.context['mapbox_style'], settings.MAPBOX_STYLE_URL)


class PowerPlantDetailViewTestCase(TestCase):
    """Render the details for a PowerPlant."""

    def setUp(self):
        super().setUp()
        self.power_plant = factories.PowerPlantFactory(published=True)

    def test_get_powerplant(self):
        """Fetch the PowerPlant detail page."""

        with self.assertTemplateUsed('infrastructure/powerplant_detail.html'):
            response = self.client.get(self.power_plant.get_absolute_url())
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, self.power_plant.name)

    def test_unpublished_project(self):
        """You should not be able to view unpublished PowerPlants."""

        self.power_plant.published = False
        self.power_plant.save()

        response = self.client.get(self.power_plant.get_absolute_url())
        self.assertEqual(response.status_code, 404)

    def test_map_context(self):
        """Mapbox configuration should be in the template."""

        response = self.client.get(self.power_plant.get_absolute_url())
        self.assertEqual(response.context['mapbox_token'], settings.MAPBOX_TOKEN)
        self.assertEqual(response.context['mapbox_style'], settings.MAPBOX_STYLE_URL)

    def test_power_plant_cost(self):
        """Power Plant cost and currency should be in the template"""

        self.power_plant.total_cost = 1000000
        self.power_plant.total_cost_currency = 'USD'
        self.power_plant.save()
        response = self.client.get(self.power_plant.get_absolute_url())

        with self.subTest("Cost in context"):
            self.assertEqual(response.context['object'].total_cost,
                             self.power_plant.total_cost)
            self.assertEqual(response.context['object'].total_cost_currency,
                             self.power_plant.total_cost_currency)

        with self.subTest("Cost formatting"):
            self.assertContains(response, "1.0 million")
            self.assertContains(response, self.power_plant.total_cost_currency)

    def test_power_plant_initiatives(self):
        """Initiatives should include unique set of related project and power plant initiatives"""

        init_a = factories.InitiativeFactory()
        init_b = factories.InitiativeFactory()
        init_c = factories.InitiativeFactory()
        init_d = factories.InitiativeFactory()
        init_not_included = factories.InitiativeFactory()
        proj1 = factories.ProjectFactory(power_plant=self.power_plant, published=True,
                                         initiatives=(init_a, init_b))
        proj2 = factories.ProjectFactory(power_plant=self.power_plant, published=True,
                                         initiatives=(init_b, init_c))
        self.power_plant.plant_initiatives.add(init_a)
        self.power_plant.plant_initiatives.add(init_d)
        self.power_plant.published = True
        self.power_plant.save()

        response = self.client.get(self.power_plant.get_absolute_url())

        initiatives = response.context['initiatives']
        self.assertEqual(len(initiatives), 4)

        with self.subTest("Initiatives in context"):
            self.assertIn(init_a, initiatives)
            self.assertIn(init_b, initiatives)
            self.assertIn(init_c, initiatives)
            self.assertIn(init_d, initiatives)
            self.assertNotIn(init_not_included, initiatives)

        with self.subTest("Initiative names in template"):
            self.assertContains(response, init_a.name)
            self.assertContains(response, init_b.name)
            self.assertContains(response, init_c.name)
            self.assertContains(response, init_d.name)
            self.assertNotContains(response, init_not_included.name)


class MapViewTestCase(TestCase):
    """View the map of all projects.

    Projects are loaded asynchronously via the API and aren't part of the template context itself.
    """

    def setUp(self):
        super().setUp()
        self.url = reverse('website-map')

    def test_render_page(self):
        """Fetch the page and render the template."""

        with self.assertTemplateUsed('infrastructure/megamap.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)

    def test_map_context(self):
        """Mapbox configuration should be in the template."""

        response = self.client.get(self.url)
        self.assertEqual(response.context['mapbox_token'], settings.MAPBOX_TOKEN)
        self.assertEqual(response.context['mapbox_style'], settings.MAPBOX_STYLE_URL)


class ProjectListViewTestCase(TestCase):
    """List projects from the database."""

    def setUp(self):
        super().setUp()
        self.project = factories.ProjectFactory(published=True)
        self.other = factories.ProjectFactory(published=True)
        self.url = reverse('infrastructure:project-list')

    def test_get_listing(self):
        """Render the list of projects."""

        with self.assertTemplateUsed('infrastructure/project_list.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, self.project.get_absolute_url())
            self.assertContains(response, self.other.get_absolute_url())

    def test_unpublished_project(self):
        """Unpublished projects shouldn't be listed."""

        self.other.published = False
        self.other.save()

        with self.assertTemplateUsed('infrastructure/project_list.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, self.project.get_absolute_url())
            self.assertNotContains(response, self.other.get_absolute_url())


class CountryProjectListViewTestCase(TestCase):
    """Filter projects down to those in a given country."""

    def setUp(self):
        super().setUp()
        self.china = CountryFactory(name='China', slug='china')
        self.india = CountryFactory(name='India', slug='india')
        self.china_project = factories.ProjectFactory(published=True)
        self.china_project.countries.add(self.china)
        self.india_project = factories.ProjectFactory(published=True)
        self.india_project.countries.add(self.india)
        self.all_project = factories.ProjectFactory(published=True)
        self.all_project.countries.add(self.china, self.india)

    def test_get_listing(self):
        """Get projects for a given country."""

        for country in ('china', 'india'):
            with self.subTest('List projects in {}'.format(country)):
                url = reverse('infrastructure:country-project-list',
                              kwargs={'country_slug': country})
                with self.assertTemplateUsed('infrastructure/project_list.html'):
                    response = self.client.get(url)
                    self.assertEqual(response.status_code, 200)
                    self.assertContains(response, self.all_project.get_absolute_url())
                    if country == 'china':
                        self.assertContains(response, self.china_project.get_absolute_url())
                        self.assertNotContains(response, self.india_project.get_absolute_url())
                    elif country == 'india':
                        self.assertNotContains(response, self.china_project.get_absolute_url())
                        self.assertContains(response, self.india_project.get_absolute_url())

    def test_unpublished_project(self):
        """Unpublished projects shouldn't be included in the listings."""

        self.all_project.published = False
        self.all_project.save()

        for country in ('china', 'india'):
            with self.subTest('Unpublished projects in {}'.format(country)):
                url = reverse('infrastructure:country-project-list',
                              kwargs={'country_slug': country})
                response = self.client.get(url)
                self.assertEqual(response.status_code, 200)
                self.assertNotContains(response, self.all_project.get_absolute_url())


class InitiativeDetailViewTestCase(TestCase):
    """View the details of an initiative."""

    def setUp(self):
        super().setUp()
        self.initiative = factories.InitiativeFactory(published=True)

    def test_get_initiative(self):
        """Fetch the initiative detail page."""

        with self.assertTemplateUsed('infrastructure/initiative_detail.html'):
            response = self.client.get(self.initiative.get_absolute_url())
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, self.initiative.name)

    def test_unpublished_initiative(self):
        """You should not be able to view unpublished initiatives."""

        self.initiative.published = False
        self.initiative.save()

        response = self.client.get(self.initiative.get_absolute_url())
        self.assertEqual(response.status_code, 404)


class InitiativeListViewTestCase(TestCase):
    """List tracked initiatives from the database."""

    def setUp(self):
        super().setUp()
        self.initiative = factories.InitiativeFactory(published=True)
        self.other = factories.InitiativeFactory(published=True)
        self.url = reverse('infrastructure:initiative-list')

    def test_get_listing(self):
        """Render the list of initiatives."""

        with self.assertTemplateUsed('infrastructure/initiative_list.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, self.initiative.get_absolute_url())
            self.assertContains(response, self.other.get_absolute_url())

    def test_unpublished_initiative(self):
        """Unpublished initiatives shouldn't be listed."""

        self.other.published = False
        self.other.save()

        with self.assertTemplateUsed('infrastructure/initiative_list.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, self.initiative.get_absolute_url())
            self.assertNotContains(response, self.other.get_absolute_url())


class GeoUploadViewTestCase(TestCase):
    """Staff can upload new geo information as GeoJSON or KML."""

    def setUp(self):
        super().setUp()
        self.user = UserFactory(username='staff')
        self.user.set_password('test')
        self.user.is_staff = True
        self.user.save()
        # User needs permissions for GeometryStores
        ct = ContentType.objects.get_for_model(GeometryStore)
        change_perm = Permission.objects.get(
            content_type=ct, codename='change_geometrystore')
        self.user.user_permissions.add(change_perm)
        self.client.login(username='staff', password='test')
        self.url = reverse('infrastructure-admin:project-geo-upload')
        self.handle, self.filename = tempfile.mkstemp(suffix='.geojson')
        os.close(self.handle)
        with open(self.filename, 'w') as f:
            data = {
               'type': 'Point',
               'coordinates': [30, 10]
            }
            json.dump(data, f)

    def tearDown(self):
        super().tearDown()
        os.remove(self.filename)

    def test_render_form(self):
        """Get the page and render the form."""

        with self.subTest('Valid staff login'):
            with self.assertTemplateUsed('infrastructure/admin/geo_upload_form.html'):
                response = self.client.get(self.url)
                self.assertEqual(response.status_code, 200)

        with self.subTest('Staff required'):
            self.user.is_staff = False
            self.user.save()
            response = self.client.get(self.url)
            self.assertRedirects(response, '{}?next={}'.format(reverse('admin:login'), self.url))

    def test_valid_upload(self):
        """Upload a valid geo shape."""

        with open(self.filename, 'r') as f:
            data = {
                'project': '',
                'label': '',
                'geo_file': f,
            }
            response = self.client.post(self.url, data=data)
            geo = GeometryStore.objects.get(label=os.path.basename(self.filename))
            redirect = reverse('admin:locations_geometrystore_change', args=(geo.id,))
            self.assertRedirects(response, redirect)

    def test_custom_label(self):
        """Change the label for the uploaded geo store."""

        with open(self.filename, 'r') as f:
            data = {
                'project': '',
                'label': 'My Point',
                'geo_file': f,
            }
            response = self.client.post(self.url, data=data)
            geo = GeometryStore.objects.get(label='My Point')
            redirect = reverse('admin:locations_geometrystore_change', args=(geo.id,))
            self.assertRedirects(response, redirect)

    def test_upload_for_project(self):
        """Associated the shape with a project."""

        project = factories.ProjectFactory()

        with open(self.filename, 'r') as f:
            data = {
                'project': project.pk,
                'label': '',
                'geo_file': f,
            }
            response = self.client.post(self.url, data=data)
            geo = GeometryStore.objects.get(label=os.path.basename(self.filename))
            redirect = reverse('admin:locations_geometrystore_change', args=(geo.id,))
            self.assertRedirects(response, redirect)
            project.refresh_from_db()
            self.assertEqual(project.geo, geo)

    def test_invalid_shape(self):
        """Handle invalid shapes given by the user."""

        with open(self.filename, 'w') as f:
            f.write('XXXX')

        with open(self.filename, 'r') as f:
            data = {
                'project': '',
                'label': '',
                'geo_file': f,
            }
            response = self.client.post(self.url, data=data)
            self.assertContains(
                response, 'Unable to create geodata from uploaded file', status_code=500)


class ProjectCSVExportTestCase(TestCase):
    """Export current projects as a CSV."""

    def setUp(self):
        super().setUp()
        refresh_views()
        self.user = UserFactory(username='staff')
        self.user.set_password('test')
        self.user.is_staff = True
        self.user.save()
        self.client.login(username='staff', password='test')
        self.url = reverse('infrastructure-admin:projects-export-view')
        self.project = factories.ProjectFactory()
        self.other = factories.ProjectFactory()

    def test_get_csv(self):
        """Download the CSV of projects."""

        with self.subTest('Staff download'):
            response = self.client.get(self.url)
            self.assertEqual(response['Content-Type'], 'text/csv')
            self.assertEqual(response.status_code, 200)

        with self.subTest('Non-staff user'):
            self.user.is_staff = False
            self.user.save()
            response = self.client.get(self.url)
            self.assertRedirects(response, '{}?next={}'.format(reverse('admin:login'), self.url))

    def test_csv_results(self):
        """Spot checking some of the CSV results."""

        response = self.client.get(self.url)
        stream = io.StringIO(response.content.decode('utf-8'))
        results = csv.DictReader(stream)
        headers = ('identifier',
                   'name',
                   'infrastructure_type',
                   'countries',
                   'regions',
                   'contractors',
                   'initiatives',
                   'operators',
                   'funding_sources',
                   'funding_amounts',
                   'funding_currencies',
                   'fuel_type',
                   'fuel_category',
                   'consultants',
                   'implementing_agencies',
                   'manufacturers',
                   'status',
                   'new',
                   'verified',
                   'total_cost',
                   'total_cost_currency',
                   'project_owners',
                   'project_owners_stake',
                   'substation_name',
                   'substation_capacity',
                   'substation_voltage',
                   'project_capacity_timeframe',
                   'start_day',
                   'start_month',
                   'start_year',
                   'commencement_day',
                   'commencement_month',
                   'commencement_year',
                   'planned_completion_day',
                   'planned_completion_month',
                   'planned_completion_year',
                   'estimated_project_output',
                   'estimated_project_output_unit',
                   'nox_reduction_system',
                   'power_plant_id',
                   'power_plant_name',
                   'project_CO2_emissions',
                   'project_CO2_emissions_unit',
                   'project_capacity',
                   'project_capacity_unit',
                   'project_output',
                   'project_output_unit',
                   'project_output_year',
                   'sox_reduction_system',
                   'project_length',
                   'pipeline_diameter',
                   'pipeline_diameter_unit',
                   'pipeline_metered',
                   'pipeline_throughput',
                   'pipeline_throughput_unit',
                   'pipeline_throughput_timeframe',
                   'pipeline_throughput_year',
                   'design_voltage',
                   'direct_current',
                   'electricity_flow',
                   'estimated_transfer_capacity',
        )
        self.assertEqual(sorted(results.fieldnames), sorted(list(headers)))
        projects = {
            str(self.project.identifier): self.project,
            str(self.other.identifier): self.other,
        }
        for row in results:
            expected = projects[row['identifier']]
            self.assertEqual(row['name'], expected.name)

    def test_project_fuel(self):
        """Ensure related fuel relations are included in CSV export"""

        fuel1 = factories.FuelFactory()
        fuel2 = factories.FuelFactory()
        project1 = factories.ProjectFactory(fuels=(fuel1, fuel2),
                                            countries=(CountryFactory(),))
        for row in self.get_results():
            if row['identifier'] == str(project1.identifier):
                self.assertTrue(fuel1.name in row['fuel_type'])
                self.assertTrue(fuel2.name in row['fuel_type'])
                self.assertTrue(fuel1.fuel_category.name in row['fuel_category'])
                self.assertTrue(fuel2.fuel_category.name in row['fuel_category'])

    def test_project_substations(self):
        """Ensure related substations are included in CSV export"""
        project1 = factories.ProjectFactory(countries=(CountryFactory(),))
        sub_station1 = factories.ProjectSubstationFactory(project=project1)
        sub_station2 = factories.ProjectSubstationFactory(project=project1)

        for row in self.get_results():
            if row['identifier'] == str(project1.identifier):
                substations = list(zip(row['substation_name'].split(','),
                                       row['substation_capacity'].split(','),
                                       row['substation_voltage'].split(','))
                                   )

                with self.subTest('Substation 1'):
                    self.assertTrue(sub_station1.name in substations[0][0])
                    self.assertTrue(str(sub_station1.capacity) in substations[0][1])
                    self.assertTrue(str(sub_station1.voltage) in substations[0][2])

                with self.subTest('Substation 2'):
                    self.assertTrue(sub_station2.name in substations[1][0])
                    self.assertTrue(str(sub_station2.capacity) in substations[1][1])
                    self.assertTrue(str(sub_station2.voltage) in substations[1][2])

    def test_project_owners_stake(self):
        """Ensure related owners stakes are in CSV export"""

        project1 = factories.ProjectFactory()
        stake1 = factories.ProjectOwnerStakeFactory(project=project1)
        stake2 = factories.ProjectOwnerStakeFactory(project=project1, percent_owned=None)

        for row in self.get_results():
            if row['identifier'] == str(project1.identifier):
                owners = list(zip(
                    row['project_owners'].split(','),
                    row['project_owners_stake'].split(','))
                )

                with self.subTest('Owner stake 1'):
                    self.assertTrue(stake1.owner.name in owners[0][0])
                    self.assertTrue(str(stake1.percent_owned) in owners[0][1])

                with self.subTest('Owner stake 2'):
                    self.assertTrue(stake2.owner.name in owners[1][0])
                    self.assertTrue('NULL' in owners[1][1])

    def test_project_manufacturers(self):
        """Ensure related manufacturers are included in CSV export"""

        org1 = OrganizationFactory()
        org2 = OrganizationFactory()
        project1 = factories.ProjectFactory(manufacturers=(org1, org2),
                                            countries=(CountryFactory(),))
        for row in self.get_results():
            if row['identifier'] == str(project1.identifier):
                self.assertTrue(org1.name in row['manufacturers'])
                self.assertTrue(org2.name in row['manufacturers'])

    def test_project_consultants(self):
        """Ensure related consultants are included in CSV export"""

        org1 = OrganizationFactory()
        org2 = OrganizationFactory()
        org3 = OrganizationFactory()
        project1 = factories.ProjectFactory(consultants=(org1, org2),
                                            countries=(CountryFactory(),))
        for row in self.get_results():
            if row['identifier'] == str(project1.identifier):
                self.assertTrue(org1.name in row['consultants'])
                self.assertTrue(org2.name in row['consultants'])
                self.assertFalse(org3.name in row['consultants'])

    def test_project_implementing_agencies(self):
        """Ensure related implementers are included in CSV export"""

        org1 = OrganizationFactory()
        org2 = OrganizationFactory()
        org3 = OrganizationFactory()
        project1 = factories.ProjectFactory(implementers=(org1, org2),
                                            countries=(CountryFactory(),))
        for row in self.get_results():
            if row['identifier'] == str(project1.identifier):
                self.assertTrue(org1.name in row['implementing_agencies'])
                self.assertTrue(org2.name in row['implementing_agencies'])
                self.assertFalse(org3.name in row['implementing_agencies'])

    def test_power_plant_name(self):
        """Ensure Power Plant name is in export"""

        project1 = factories.ProjectFactory(power_plant=factories.PowerPlantFactory(),
                                            countries=(CountryFactory(),))
        for row in self.get_results():
            if row['identifier'] == str(project1.identifier):
                self.assertEqual(project1.power_plant.name, row['power_plant_name'])

    def get_results(self):
        response = self.client.get(self.url)
        stream = io.StringIO(response.content.decode('utf-8'))
        return csv.DictReader(stream)

    def test_never_cache_is_enabled(self):
        response = self.client.get(self.url)
        self.assertEqual(response['Cache-Control'].__contains__('max-age=0'), True)


class PowerPlantCSVExportTestCase(TestCase):
    """Export current projects as a CSV."""

    def setUp(self):
        super().setUp()
        refresh_views()
        self.user = UserFactory(username='staff')
        self.user.set_password('test')
        self.user.is_staff = True
        self.user.save()
        self.client.login(username='staff', password='test')
        self.url = reverse('infrastructure-admin:powerplants-export-view')

    def test_get_csv(self):
        """Download the CSV of projects."""

        with self.subTest('Staff download'):
            response = self.client.get(self.url)
            self.assertEqual(response['Content-Type'], 'text/csv')
            self.assertEqual(response.status_code, 200)

        with self.subTest('Non-staff user'):
            self.user.is_staff = False
            self.user.save()
            response = self.client.get(self.url)
            self.assertRedirects(response, '{}?next={}'.format(reverse('admin:login'), self.url))

    def test_csv_results(self):
        """Spot checking some of the CSV results."""

        response = self.client.get(self.url)
        stream = io.StringIO(response.content.decode('utf-8'))
        results = csv.DictReader(stream)
        headers = (
                'plant_id',
                'plant_name',
                'plant_countries',
                'plant_regions',
                'plant_operators',
                'plant_owners',
                'plant_owners_stake',
                'plant_slug',
                'plant_status',
                'plant_sources',
                'plant_total_cost',
                'plant_total_cost_currency',
                'plant_year_online',
                'plant_month_online',
                'plant_day_online',
                'plant_decommissioning_year',
                'plant_decommissioning_month',
                'plant_decommissioning_day',
                'plant_capacity',
                'plant_capacity_unit',
                'plant_output',
                'plant_output_unit',
                'plant_output_year',
                'plant_estimated_output',
                'plant_estimated_output_unit',
                'plant_CO2_emissions',
                'plant_co2_emissions_unit',
                'plant_grid_connected',
                'plant_description',
                'plant_created_at',
                'plant_updated_at',
                'plant_published',
        )
        self.assertEqual(results.fieldnames, list(headers))

    def test_plant_countries(self):
        """Ensure multiple countries are in CSV export"""
        country1 = CountryFactory()
        country2 = CountryFactory()
        power_plant = factories.PowerPlantFactory(countries=(country1, country2))
        response = self.client.get(self.url)
        stream = io.StringIO(response.content.decode('utf-8'))
        results = csv.DictReader(stream)
        for row in results:
            if row['plant_id'] == str(power_plant.id):
                self.assertTrue(country1.name in row['plant_countries'])
                self.assertTrue(country2.name in row['plant_countries'])

    def test_plant_regions(self):
        """Ensure multiple regions are in CSV export"""
        region1 = RegionFactory()
        region2 = RegionFactory()
        power_plant = factories.PowerPlantFactory(regions=(region1, region2))
        response = self.client.get(self.url)
        stream = io.StringIO(response.content.decode('utf-8'))
        results = csv.DictReader(stream)
        for row in results:
            if row['plant_id'] == str(power_plant.id):
                self.assertTrue(region1.name in row['plant_regions'])
                self.assertTrue(region2.name in row['plant_regions'])

    def test_plant_operators(self):
        """Ensure multiple operators are in CSV export"""
        operator1 = OrganizationFactory()
        operator2 = OrganizationFactory()
        power_plant = factories.PowerPlantFactory(operators=(operator1, operator2))
        response = self.client.get(self.url)
        stream = io.StringIO(response.content.decode('utf-8'))
        results = csv.DictReader(stream)
        for row in results:
            if row['plant_id'] == str(power_plant.id):
                self.assertTrue(operator1.name in row['plant_operators'])
                self.assertTrue(operator2.name in row['plant_operators'])

    def test_plant_owner_stakes(self):
        """Ensure owner stakes are in CSV export"""

        power_plant = factories.PowerPlantFactory()
        stake1 = factories.PlantOwnerStakeFactory(power_plant=power_plant)
        stake2 = factories.PlantOwnerStakeFactory(power_plant=power_plant, percent_owned=None)
        stake_non = factories.PlantOwnerStakeFactory()
        response = self.client.get(self.url)
        stream = io.StringIO(response.content.decode('utf-8'))
        results = csv.DictReader(stream)
        for row in results:
            if row['plant_id'] == str(power_plant.id):
                owners = list(zip(row['plant_owners'].split(','), row['plant_owners_stake'].split(',')))

                with self.subTest('Owner stake 1'):
                    self.assertTrue(stake1.owner.name in owners[0][0])
                    self.assertTrue(str(stake1.percent_owned) in owners[0][1])

                with self.subTest('Owner stake 2'):
                    self.assertTrue(stake2.owner.name in owners[1][0])
                    self.assertTrue('NULL' in owners[1][1])

                with self.subTest('Excluded owner stake'):
                    self.assertFalse(stake_non.owner.name in row['plant_owners'])

    def test_never_cache_is_enabled(self):
        response = self.client.get(self.url)
        self.assertEqual(response['Cache-Control'].__contains__('max-age=0'), True)
