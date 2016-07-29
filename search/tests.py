from django.test import TestCase
from django.conf import settings
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Index, Search
from elasticsearch_dsl.connections import connections
from urllib.parse import urlparse
from writings.tests.factories import EntryFactory
from .mappings import EntryMapping
from .documents import EntryDoc

ELASTICSEARCH_URL = getattr(settings, 'ELASTICSEARCH_URL', 'http://localhost:9200')
TEST_INDEX = 'test_reconnectingasia'


class SearchTestCase(TestCase):

    def setUp(self):
        # TODO: default connection that is parsed from url to dict like {"host": "localhost", "port": 9200}
        parsed_url = urlparse(ELASTICSEARCH_URL)
        connections.create_connection(hosts=[parsed_url.netloc], timeout=20)
        self.client = Elasticsearch([ELASTICSEARCH_URL])
        self.index = Index(TEST_INDEX)
        self.index.doc_type(EntryDoc)
        if not self.index.exists():
            self.index.create()
        else:
            self.index.flush()

    def tearDown(self):
        self.index.delete()

    def test_create_doc(self):
        self.client.index(TEST_INDEX, 'test_doc', {'name': 'Foo'})

    def test_index_writings_entries(self):
        EntryDoc.init()
        entry_objects = EntryFactory.create_batch(30)
        mapper = EntryMapping()
        for obj in entry_objects:
            doc_obj = mapper.to_doc(obj)
            doc_obj.save()

        response = Search().query().execute()

        self.assertEqual(len(entry_objects), response.hits.total)
