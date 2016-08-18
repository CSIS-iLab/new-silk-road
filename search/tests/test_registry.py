from django.test import SimpleTestCase
from unittest.mock import Mock, call
from search.registry import SearchRegistry
from search.tests.mocks import FakeDocType


class SearchRegistryTestCase(SimpleTestCase):

    def test_has_serializer_module(self):
        registry = SearchRegistry('search.tests.mocks')

        self.assertIsNotNone(registry._serializer_module)

        serializer_class = getattr(registry._serializer_module, 'FakeSerializer', None)
        self.assertIsNotNone(serializer_class)

    def test__register_serializer_doctype_method(self):
        registry = SearchRegistry('search.tests.mocks')
        serializer_class = getattr(registry._serializer_module, 'FakeSerializer', None)
        registry._register_serializer_doctype(serializer_class)

        self.assertIn('testindex', registry._doctypes)
        self.assertIn(FakeDocType, registry._doctypes['testindex'])

    def test__register_serializer_model_method(self):
        registry = SearchRegistry('search.tests.mocks')
        serializer_class = getattr(registry._serializer_module, 'FakeSerializer', None)
        registry._register_serializer_model(serializer_class)

        self.assertIn('search.tests.Foo', registry._model_serializers)

    def test_register_method_calls__register_serializer_model(self):
        registry = SearchRegistry('search.tests.mocks')
        registry._register_serializer_model = Mock()

        registry.register(('FakeSerializer', 'FakeSerializerTwo'))
        FakeSerializer = getattr(registry._serializer_module, 'FakeSerializer', None)
        FakeSerializerTwo = getattr(registry._serializer_module, 'FakeSerializerTwo', None)

        call_list = [call(FakeSerializer), call(FakeSerializerTwo)]
        registry._register_serializer_model.assert_has_calls(call_list)

    def test_register_method_calls__register_serializer_doctype(self):
        registry = SearchRegistry('search.tests.mocks')
        registry._register_serializer_doctype = Mock()

        registry.register(('FakeSerializer', 'FakeSerializerTwo'))
        FakeSerializer = getattr(registry._serializer_module, 'FakeSerializer', None)
        FakeSerializerTwo = getattr(registry._serializer_module, 'FakeSerializerTwo', None)

        call_list = [call(FakeSerializer), call(FakeSerializerTwo)]
        registry._register_serializer_doctype.assert_has_calls(call_list)

    def test_doctypes_for_index(self):
        registry = SearchRegistry('search.tests.mocks')
        registry.register(('FakeSerializer',))
        doc_types = registry.get_doctypes_for_index('testindex')

        self.assertIn(FakeDocType, doc_types)
        self.assertEqual(len(doc_types), 1)

    def test_serializer_for_model(self):
        self.fail()
