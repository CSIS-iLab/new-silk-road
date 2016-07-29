from django.test import TestCase
from search.documents import EntryDoc, ProjectDoc
from search.mappings import ProjectMapping, EntryMapping
from .factories import (
    ProjectFactory,
    CountryFactory,
    EntryFactory,
    EntryCategoryFactory,
)


class MappingsTestCase(TestCase):

    def test_project_mapping(self):
        obj = ProjectFactory.create(name='Test title', countries=CountryFactory.create_batch(4), status=5)
        mapping = ProjectMapping()
        doc = mapping.to_doc(obj)

        self.assertIsInstance(doc, ProjectDoc)
        self.assertEqual(doc.name, 'Test title')
        self.assertEqual(len(doc.countries), 4)
        self.assertEqual(obj.status, 5)
        # doc should have string representation of choice
        self.assertEqual(obj.get_status_display(), doc.status)

    def test_entry_mapping(self):
        obj = EntryFactory.create(
            title='Test title',
            categories=EntryCategoryFactory.create_batch(4),
            published=True
        )
        mapping = EntryMapping()
        doc = mapping.to_doc(obj)

        self.assertIsInstance(doc, EntryDoc)
        self.assertEqual(doc.title, 'Test title')
        self.assertEqual(len(doc.categories), 4)

        for category in doc.categories:
            self.assertIn('name', category)
        self.assertEqual(obj.author, doc.author)
        self.assertEqual(obj.content, doc.content)
        self.assertEqual(obj.description, doc.description)
        self.assertEqual(obj.publication_date, doc.publication_date)
