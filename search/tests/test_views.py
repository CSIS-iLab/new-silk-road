from unittest.mock import patch
from unittest import skip

from django.urls import reverse

from infrastructure.tests.factories import InfrastructureTypeFactory, ProjectFactory
from locations.tests.factories import CountryFactory

from ..searches import SiteSearch
from ..serializers import ProjectSerializer
from .base import BaseSearchTestCase
from .settings import TEST_SEARCH

@skip("Redirecting to placeholder")
class TestSearchViewSet(BaseSearchTestCase):

    def setUp(self):
        super().setUp()
        self.url = reverse('search:search')
        self.index_patch = patch.object(SiteSearch, 'index', TEST_SEARCH['default']['index'])
        self.index_patch.start()
        india = CountryFactory(name='India')
        china = CountryFactory(name='China')
        rail_type = InfrastructureTypeFactory(name='Railroad')
        road_type = InfrastructureTypeFactory(name='Road')

        self.china_rail = ProjectFactory(
            name='China Rail Project',
            infrastructure_type=rail_type, countries=[china, ])
        self.china_road = ProjectFactory(
            name='China Road Project',
            infrastructure_type=road_type, countries=[china, ])
        self.india_rail = ProjectFactory(
            name='India Rail Project',
            infrastructure_type=rail_type, countries=[india, ])
        self.india_road = ProjectFactory(
            name='India Road Project',
            infrastructure_type=road_type, countries=[india, ])
        serializer = ProjectSerializer()
        serializer.create_document(self.china_rail).save()
        serializer.create_document(self.china_road).save()
        serializer.create_document(self.india_rail).save()
        serializer.create_document(self.india_road).save()
        self.index.refresh()

    def tearDown(self):
        super().tearDown()
        self.index_patch.stop()

    def test_that_view_loads(self):
        """Load search page with no query string."""

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_with_search_param(self):
        """Search for objects in the index."""

        with self.subTest('No results'):
            params = {'q': '123'}
            response = self.client.get(self.url, params)
            self.assertContains(response, 'No results found')

        with self.subTest('Find project'):
            self.index.refresh()
            params = {'q': 'China Rail'}
            response = self.client.get(self.url, params)
            self.assertContains(response, self.china_rail.get_absolute_url())
    
    def test_with_search_facets(self):
        """Narrow results by using facets."""

        with self.subTest('Find all projects'):
            params = {
                'q': 'project',
                'facet': ['_category:Project', ],
            }
            response = self.client.get(self.url, params)
            self.assertContains(response, self.china_rail.get_absolute_url())
            self.assertContains(response, self.china_road.get_absolute_url())
            self.assertContains(response, self.india_rail.get_absolute_url())
            self.assertContains(response, self.india_road.get_absolute_url())

        with self.subTest('Find road projects'):
            params = {
                'q': 'project',
                'facet': ['_category:Project', 'infrastructure_type:Road', ],
            }
            response = self.client.get(self.url, params)
            self.assertNotContains(response, self.china_rail.get_absolute_url())
            self.assertContains(response, self.china_road.get_absolute_url())
            self.assertNotContains(response, self.india_rail.get_absolute_url())
            self.assertContains(response, self.india_road.get_absolute_url())

        with self.subTest('Find road projects in China'):
            params = {
                'q': 'project',
                'facet': [
                    '_category:Project',
                    'infrastructure_type:Road',
                    'project_location:China',
                ],
            }
            response = self.client.get(self.url, params)
            self.assertNotContains(response, self.china_rail.get_absolute_url())
            self.assertContains(response, self.china_road.get_absolute_url())
            self.assertNotContains(response, self.india_rail.get_absolute_url())
            self.assertNotContains(response, self.india_road.get_absolute_url())

    def test_search_pagination(self):
        """User can select page size and the page they want to view."""

        with self.subTest('Change page size'):
            params = {
                'q': 'project',
                'size': '2'
            }
            response = self.client.get(self.url, params)
            self.assertEqual(response.context['search']['offset'], 0)
            self.assertEqual(response.context['search']['size'], 2)
            self.assertEqual(len(response.context['search']['results']), 2)
            self.assertEqual(response.context['search']['total'], 4)

        with self.subTest('Get next page'):
            params = {
                'q': 'project',
                'size': '2',
                'offset': '2',
            }
            response = self.client.get(self.url, params)
            self.assertEqual(response.context['search']['offset'], 2)
            self.assertEqual(response.context['search']['size'], 2)
            self.assertEqual(len(response.context['search']['results']), 2)
            self.assertEqual(response.context['search']['total'], 4)

        with self.subTest('Invalid page'):
            params = {
                'q': 'project',
                'size': 'foo',
                'offset': 'bar',
            }
            response = self.client.get(self.url, params)
            self.assertEqual(response.context['search']['offset'], 0)
            self.assertEqual(response.context['search']['size'], 20)
            self.assertEqual(len(response.context['search']['results']), 4)
            self.assertEqual(response.context['search']['total'], 4)
