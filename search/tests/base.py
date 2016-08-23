from django.test import TestCase, override_settings
from elasticsearch_dsl.connections import connections
import django_rq
from search.utils import create_search_index
from .settings import TEST_SEARCH


class BaseSearchTestCase(TestCase):

    @override_settings(SEARCH=TEST_SEARCH)
    def setUp(self):
        from django.conf import settings
        SEARCH = getattr(settings, 'SEARCH')

        connections.create_connection('testing', **SEARCH['default']['connections'])
        self.index = create_search_index(SEARCH['default']['index'], SEARCH['default']['doc_types'], connection='testing')

    def tearDown(self):
        self.index.delete()
        queue = django_rq.get_queue()
        queue.empty()
