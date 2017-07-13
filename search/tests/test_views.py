from django.test import TestCase
from django.urls import reverse
from django.conf import settings

from search.tasks import create_search_index, rebuild_indices


class TestSearchViewSet(TestCase):
    def setUp(self):
        self.index_name = getattr(settings, 'SEARCH')['default']['index']
        self.url = reverse('search:search')
        create_search_index(index_name=self.index_name, delete_if_exists=True)
        rebuild_indices(settings.SEARCH)

    def test_that_view_loads(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_with_search_param(self):

        with self.subTest('no results'):
            params = {'q': '123'}
            response = self.client.get(self.url, params)
            self.assertIn('No results found', response.content.decode())
        print(response.context)
        print('\n\n')
        print(response.context[0]['search']['results'])
        print('\n\n')

    def tearDown(self):
        # Rebuild the index
        rebuild_indices(settings.SEARCH)
