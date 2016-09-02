from django.test import TestCase, override_settings
from elasticsearch_dsl.connections import connections
from elasticsearch_dsl import DocType, Search, Index
import django_rq
from search import documents
from .settings import TEST_SEARCH
import inspect


@override_settings(SEARCH=TEST_SEARCH)
class BaseSearchTestCase(TestCase):

    def setUp(self):
        from django.conf import settings
        SEARCH = getattr(settings, 'SEARCH')

        connections.create_connection('testing', **SEARCH['default']['connections'])
        self.index = Index(SEARCH['default']['index'], using='testing')
        # This is needed for test_documents, but has side effects in all running tests
        doctypes_list = (
            value for name, value
            in inspect.getmembers(documents)
            if not name.startswith('_') and
            inspect.isclass(value) and
            issubclass(value, DocType) and
            name != DocType.__name__
        )

        for doctype in doctypes_list:
            # Remove assigned index
            doctype._doc_type.index = None
            # Associate docs with test index
            self.index.doc_type(doctype)

        if self.index.exists():
            self.index.delete(ignore=404)
        self.index.create()

        self.search = Search(index=SEARCH['default']['index'])

    def tearDown(self):
        self.index.delete()
        queue = django_rq.get_queue()
        queue.empty()
