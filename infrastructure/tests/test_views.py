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

from locations.factories import CountryFactory
from locations.models import GeometryStore
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
        self.assertEqual(
            results.fieldnames,
            ['identifier', 'name', 'infrastructure_type', 'countries', 'regions', 'contractors',
             'initiatives', 'operators', 'funding_sources', 'funding_amounts', 'funding_currencies',
             'status', 'new', 'verified', 'total_cost', 'total_cost_currency', 'start_day',
             'start_month', 'start_year', 'commencement_day', 'commencement_month',
             'commencement_year', 'planned_completion_day', 'planned_completion_month',
             'planned_completion_year'])
        expected = [self.other, self.project, ]
        for i, row in enumerate(results):
            self.assertEqual(row['name'], expected[i].name)
            self.assertEqual(row['identifier'], str(expected[i].identifier))
