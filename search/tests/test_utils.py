from django.test import TestCase
from search.utils import (
    get_document_class,
    doc_id_for_instance,
    calculate_doc_id,
    DOC_ID_SEPARATOR
)
from search.documents import ProjectDoc
from .factories import EntryFactory


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


class DocIdTestCase(TestCase):

    def test_doc_id_for_instance(self):
        instance = EntryFactory(id=411)
        es_id = doc_id_for_instance(instance)

        self.assertIn('411', es_id)
        self.assertIn('writings.Entry', es_id)

    def test_calculate_doc_id(self):
        doc_id = calculate_doc_id('writings.Entry', 411)

        label, pk = doc_id.split(DOC_ID_SEPARATOR)
        self.assertEqual(label, 'writings.Entry')
        self.assertEqual(pk, '411')
