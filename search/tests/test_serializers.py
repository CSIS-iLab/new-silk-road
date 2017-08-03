from infrastructure.tests.factories import ProjectFactory
from ..documents import (
    EntryDoc,
    ProjectDoc,
    PersonDoc,
    OrganizationDoc,
)
from ..serializers import (
    ProjectSerializer,
    EntrySerializer,
    PersonSerializer,
    OrganizationSerializer,
)
from .base import BaseSearchTestCase
from .factories import (
    CountryFactory,
    EntryFactory,
    EntryCategoryFactory,
    PersonFactory,
    PositionFactory,
    OrganizationFactory,
)
from .mocks import (
    MockSerializer,
    MockDocOne
)


class SerializerTestCase(BaseSearchTestCase):

    def test_serializer_loads_doctype_class(self):
        serializer = MockSerializer()
        self.assertEqual(serializer.doc_type, MockDocOne)


class ProjectSerializerTestCase(BaseSearchTestCase):

    def test_project_serializer(self):
        obj = ProjectFactory.create(name='Test title', countries=CountryFactory.create_batch(4), status=5)
        serializer = ProjectSerializer()
        doc = serializer.create_document(obj)

        self.assertIsInstance(doc, ProjectDoc)
        self.assertEqual(doc.name, 'Test title')
        self.assertEqual(len(doc.countries), 4)
        self.assertEqual(obj.status, 5)
        # doc should have string representation of choice
        self.assertEqual(obj.get_status_display(), doc.status)


class EntrySerializerTestCase(BaseSearchTestCase):

    def test_entry_serializer(self):
        obj = EntryFactory.create(
            title='Test title',
            categories=EntryCategoryFactory.create_batch(4),
            published=True
        )
        serializer = EntrySerializer()
        doc = serializer.create_document(obj)

        self.assertIsInstance(doc, EntryDoc)
        self.assertEqual(doc.title, 'Test title')
        self.assertEqual(len(doc.categories), 4)

        for category in doc.categories:
            self.assertIn('name', category)
        self.assertEqual(obj.author, doc.author)
        self.assertEqual(obj.content_rendered, doc.content)
        self.assertEqual(obj.description, doc.description)
        self.assertEqual(obj.publication_date, doc.publication_date)


class PersonSerializerTestCase(BaseSearchTestCase):

    def test_person_serializer(self):
        num_positions = 3
        obj = PersonFactory.create(position_set=PositionFactory.build_batch(num_positions))
        serializer = PersonSerializer()
        doc = serializer.create_document(obj)

        self.assertIsInstance(doc, PersonDoc)
        self.assertEqual(len(doc.position_set), num_positions)
        self.assertTrue(hasattr(doc, 'url'))
        self.assertNotEqual(doc.identifier, '')
        self.assertIn(doc.identifier, doc.url)


class OrganizationSerializerTestCase(BaseSearchTestCase):

    def test_organization_serializer(self):
        obj = OrganizationFactory.create(countries=CountryFactory.create_batch(4))
        serializer = OrganizationSerializer()
        doc = serializer.create_document(obj)

        self.assertIsInstance(doc, OrganizationDoc)
        self.assertIsNotNone(doc.organization_types)
