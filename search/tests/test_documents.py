from django.test import TestCase
from django.conf import settings
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Index, Search
from elasticsearch_dsl.connections import connections
from urllib.parse import urlparse
from writings.tests.factories import EntryFactory
from search.mappings import EntryMapping
from search.documents import EntryDoc


ELASTICSEARCH_URL = getattr(settings, 'ELASTICSEARCH_URL', 'http://localhost:9200')
TEST_INDEX = 'test_reconnectingasia'


class DocumentsTestCase(TestCase):

    def setUp(self):
        parsed_url = urlparse(ELASTICSEARCH_URL)
        connections.create_connection(hosts=[parsed_url.netloc], timeout=20)
        self.client = Elasticsearch([ELASTICSEARCH_URL])
        self.index = Index(TEST_INDEX)
        self.index.doc_type(EntryDoc)
        if self.index.exists():
            self.index.delete()
        self.index.create()

    def tearDown(self):
        self.index.delete()

    def test_index_writings_entries(self):
        entry_objects = EntryFactory.create_batch(30)
        mapper = EntryMapping()
        for obj in entry_objects:
            doc_obj = mapper.to_doc(obj)
            doc_obj.save()

        self.index.refresh()
        s = Search()

        self.assertEqual(len(entry_objects), s.count())

    def test_writings_entry(self):
        entry = EntryFactory.create()
        mapper = EntryMapping()
        doc_obj = mapper.to_doc(entry)
        doc_obj.save()

        self.index.refresh()
        s = Search()
        response = s.execute()
        result = response[0]

        self.assertEqual(1, s.count())
        self.assertEqual(entry.id, result.id)
        self.assertEqual(entry.publication_date.isoformat(), result.publication_date)
        self.assertEqual(entry._meta.label, result._meta.label)
