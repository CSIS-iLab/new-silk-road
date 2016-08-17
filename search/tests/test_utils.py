from django.test import TestCase
from search.utils import get_document_class
from search.documents import ProjectDoc


class SearchUtilsTestCase(TestCase):

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
