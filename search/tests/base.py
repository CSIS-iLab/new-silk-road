from django.test import TestCase, override_settings
from elasticsearch_dsl.connections import connections
import django_rq
from search.utils import create_search_index
from search.documents import EntryDoc, ProjectDoc
from .settings import TEST_SEARCH


@override_settings(SEARCH=TEST_SEARCH)
class BaseSearchTestCase(TestCase):

    def setUp(self):
        from django.conf import settings
        SEARCH = getattr(settings, 'SEARCH')

        connections.create_connection('testing', **SEARCH['default']['connections'])
        self.index = create_search_index(SEARCH['default']['index'], SEARCH['default']['doc_types'], connection='testing')

        # This is needed for test_documents, but has side effects in all running tests
        self.index.doc_type(EntryDoc)
        self.index.doc_type(ProjectDoc)

    def tearDown(self):
        self.index.delete()
        queue = django_rq.get_queue()
        queue.empty()
