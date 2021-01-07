from unittest import skip
from facts.models import Organization
from infrastructure.tests.factories import ProjectFactory
from ..base import ModelSerializer, RelatedSerializer
from ..documents import (
    EntryDoc,
    ProjectDoc,
    PersonDoc,
    OrganizationDoc,
)
from ..serializers import (
    CountrySerializer,
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

@skip("Redirecting to placeholder")
class SerializerTestCase(BaseSearchTestCase):

    def test_serializer_loads_doctype_class(self):
        serializer = MockSerializer()
        self.assertEqual(serializer.doc_type, MockDocOne)

@skip("Redirecting to placeholder")
class ProjectSerializerTestCase(BaseSearchTestCase):

    def test_project_serializer(self):
        obj = ProjectFactory.create(
            name='Test title', countries=CountryFactory.create_batch(4), status=5)
        serializer = ProjectSerializer()
        doc = serializer.create_document(obj)

        self.assertIsInstance(doc, ProjectDoc)
        self.assertEqual(doc.name, 'Test title')
        self.assertEqual(len(doc.countries), 4)
        self.assertEqual(obj.status, 5)
        # doc should have string representation of choice
        self.assertEqual(obj.get_status_display(), doc.status)

@skip("Redirecting to placeholder")
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

@skip("Redirecting to placeholder")
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

@skip("Redirecting to placeholder")
class OrganizationSerializerTestCase(BaseSearchTestCase):

    def test_organization_serializer(self):
        obj = OrganizationFactory.create(countries=CountryFactory.create_batch(4))
        serializer = OrganizationSerializer()
        doc = serializer.create_document(obj)

        self.assertIsInstance(doc, OrganizationDoc)
        self.assertIsNotNone(doc.organization_types)

@skip("Redirecting to placeholder")
class ModelSerializerTestCase(BaseSearchTestCase):

    def test_meta_model(self):
        """ModelSerializers are related to Django models."""

        with self.subTest('Models are required'):
            class InvalidSerializer(ModelSerializer):
                class Meta:
                    fields = ('name', )
                    doc_type = OrganizationDoc

            with self.assertRaises(Exception):
                InvalidSerializer()

            class InvalidSerializer(ModelSerializer):
                class Meta:
                    model = None
                    fields = ('name', )
                    doc_type = OrganizationDoc

            with self.assertRaises(Exception):
                InvalidSerializer()

        with self.subTest('Models can be strings'):
            class OrgSerializer(ModelSerializer):
                class Meta:
                    model = 'facts.Organization'
                    fields = ('name', )
                    doc_type = OrganizationDoc

            instance = OrgSerializer()
            self.assertEqual(instance.model_class, Organization)

        with self.subTest('Models can be explicit classes'):
            class NewOrgSerializer(ModelSerializer):
                class Meta:
                    model = Organization
                    fields = ('name', )
                    doc_type = OrganizationDoc

            instance = NewOrgSerializer()
            self.assertEqual(instance.model_class, Organization)

        with self.subTest('Models must reference model classes'):
            class InvalidSerializer(ModelSerializer):
                class Meta:
                    model = 'decimal.Decimal'
                    fields = ('name', )
                    doc_type = OrganizationDoc

            with self.assertRaises(Exception):
                InvalidSerializer()

            class InvalidSerializer(ModelSerializer):
                class Meta:
                    model = OrganizationDoc
                    fields = ('name', )
                    doc_type = OrganizationDoc

            with self.assertRaises(Exception):
                InvalidSerializer()

    def test_meta_fields(self):
        """ModelSerializers use a subset of the related model fields."""

        with self.subTest('Fields are required'):
            class InvalidSerializer(ModelSerializer):
                class Meta:
                    model = Organization
                    doc_type = OrganizationDoc

            with self.assertRaises(Exception):
                InvalidSerializer()

            class InvalidSerializer(ModelSerializer):
                class Meta:
                    model = Organization
                    fields = None
                    doc_type = OrganizationDoc

            with self.assertRaises(Exception):
                InvalidSerializer()

        with self.subTest('Unknown field name'):
            class InvalidSerializer(ModelSerializer):
                class Meta:
                    model = Organization
                    fields = ('doesnotexist', )
                    doc_type = OrganizationDoc

            with self.assertRaises(Exception):
                InvalidSerializer()

        with self.subTest('Custom lookup'):
            class CustomFieldSerializer(ModelSerializer):
                class Meta:
                    model = Organization
                    fields = ('newfield', )
                    doc_type = OrganizationDoc

                def get_newfield(self, obj):
                    return 'newfield'

            instance = CustomFieldSerializer()
            self.assertIn('newfield', instance._attribute_field_map)

        with self.subTest('Invalid lookup'):
            # Lookup for get_<field_name> attributes must be callable
            class InvalidSerializer(ModelSerializer):
                class Meta:
                    model = Organization
                    fields = ('newfield', )
                    doc_type = OrganizationDoc

                get_newfield = 'newfield'

            with self.assertRaises(Exception):
                InvalidSerializer()

        with self.subTest('Related field'):
            class FKSerializer(ModelSerializer):
                countries = CountrySerializer()

                class Meta:
                    model = Organization
                    fields = ('name', 'countries', )
                    doc_type = OrganizationDoc

            instance = FKSerializer()
            self.assertIn('countries', instance._rel_field_names)

        with self.subTest('Invalid related field'):
            # Reference to the related serializer must be provided
            class InvalidSerializer(ModelSerializer):
                class Meta:
                    model = Organization
                    fields = ('name', 'countries', )
                    doc_type = OrganizationDoc

            with self.assertRaises(Exception):
                InvalidSerializer()

    def test_meta_doc_type(self):
        """Serializers are used to create documents."""

        with self.subTest('Doc type is required'):
            class InvalidSerializer(ModelSerializer):
                class Meta:
                    model = Organization
                    fields = ('name', )

            with self.assertRaises(Exception):
                InvalidSerializer()

            class InvalidSerializer(ModelSerializer):
                class Meta:
                    model = Organization
                    fields = ('name', )
                    doc_type = None

            with self.assertRaises(Exception):
                InvalidSerializer()

        with self.subTest('Doc types can be strings'):
            class OrgSerializer(ModelSerializer):
                class Meta:
                    model = 'facts.Organization'
                    fields = ('name', )
                    doc_type = 'search.documents.OrganizationDoc'

            instance = OrgSerializer()
            self.assertEqual(instance.doc_type, OrganizationDoc)

        with self.subTest('Doc types can be explicit classes'):
            class NewOrgSerializer(ModelSerializer):
                class Meta:
                    model = Organization
                    fields = ('name', )
                    doc_type = OrganizationDoc

            instance = NewOrgSerializer()
            self.assertEqual(instance.doc_type, OrganizationDoc)

@skip("Redirecting to placeholder")
class RelatedSerializerTestCase(BaseSearchTestCase):

    def test_mapping_class(self):
        """Related serializer requires a ModelSerializer."""

        with self.subTest('Invalid type'):
            with self.assertRaises(TypeError):
                RelatedSerializer(OrganizationDoc)

        with self.subTest('Mapping instance'):
            serializer = RelatedSerializer(OrganizationSerializer)
            self.assertTrue(isinstance(serializer.serializer, OrganizationSerializer))
