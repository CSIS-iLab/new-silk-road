from django.conf import settings
from django.test import TestCase
from django.urls import reverse

from locations.factories import CountryFactory
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
