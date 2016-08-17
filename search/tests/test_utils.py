from django.test import TestCase, override_settings
from elasticsearch_dsl.connections import connections
from search.utils import get_document_class, create_search_index
from search.documents import ProjectDoc
from search.tests.settings import TEST_SEARCH


class GetDocumentClassTestCase(TestCase):

    def test_get_document_class_raises_error_on_bad_path(self):
        with self.assertRaises(ImportError):
            get_document_class('foo.Bar')

    def test_get_document_class_gets_class_from_full_path(self):
        klass = get_document_class('search.documents.ProjectDoc')
        self.assertIsNotNone(klass)
        self.assertEqual(klass, ProjectDoc)

    def test_get_document_class_corrects_incomplete_path(self):
        klass = get_document_class('search.ProjectDoc')
        self.assertIsNotNone(klass)
        self.assertEqual(klass, ProjectDoc)


@override_settings(SEARCH=TEST_SEARCH)
class CreateSearchIndexTestCase(TestCase):

    def setUp(self):
        connections.create_connection('testing', **TEST_SEARCH['default']['connections'])

    def test_create_search_index_only(self):
        index = create_search_index('test_create')

        self.assertIsNotNone(index)

        index_dict = index.to_dict()
        self.assertNotIn('mappings', index_dict)

        index.delete()
        self.assertFalse(index.exists())

    def test_create_search_index_with_doctypes(self):
        index = create_search_index('foo', doc_types=('search.ProjectDoc', 'search.EntryDoc'))

        self.assertIsNotNone(index)

        index_dict = index.to_dict()
        self.assertIn('mappings', index_dict)

        mappings = index_dict.get('mappings')
        self.assertEqual(len(mappings.keys()), 2)
        self.assertIn('project_doc', mappings)
        self.assertIn('entry_doc', mappings)

        index.delete()
        self.assertFalse(index.exists())
