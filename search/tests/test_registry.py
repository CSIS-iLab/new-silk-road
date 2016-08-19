from django.test import SimpleTestCase
from unittest.mock import Mock, call
from search.registry import SearchRegistry
from search.tests.mocks import MockDocType, MockModel


class SearchRegistryTestCase(SimpleTestCase):

    def test_has_serializer_module(self):
        registry = SearchRegistry('search.tests.mocks')

        self.assertIsNotNone(registry._serializer_module)

        serializer_class = getattr(registry._serializer_module, 'MockSerializer', None)
        self.assertIsNotNone(serializer_class)

    def test__register_serializer_doctype_method(self):
        registry = SearchRegistry('search.tests.mocks')
        serializer_class = getattr(registry._serializer_module, 'MockSerializer', None)
        registry._register_serializer_doctype(serializer_class)

        self.assertIn('testindex', registry._doctypes)
        self.assertIn(MockDocType, registry._doctypes['testindex'])

    def test__register_serializer_model_method(self):
        registry = SearchRegistry('search.tests.mocks')
        serializer_class = getattr(registry._serializer_module, 'MockSerializer', None)
        registry._register_serializer_model(serializer_class)

        self.assertIn('search.MockModel', registry._model_serializers)

    def test_register_method_calls__register_serializer_model(self):
        registry = SearchRegistry('search.tests.mocks')
        registry._register_serializer_model = Mock()

        registry.register(('MockSerializer', 'MockSerializerTwo'))
        MockSerializer = getattr(registry._serializer_module, 'MockSerializer', None)
        MockSerializerTwo = getattr(registry._serializer_module, 'MockSerializerTwo', None)

        call_list = [call(MockSerializer), call(MockSerializerTwo)]
        registry._register_serializer_model.assert_has_calls(call_list)

    def test_register_method_calls__register_serializer_doctype(self):
        registry = SearchRegistry('search.tests.mocks')
        registry._register_serializer_doctype = Mock()

        registry.register(('MockSerializer', 'MockSerializerTwo'))
        MockSerializer = getattr(registry._serializer_module, 'MockSerializer', None)
        MockSerializerTwo = getattr(registry._serializer_module, 'MockSerializerTwo', None)

        call_list = [call(MockSerializer), call(MockSerializerTwo)]
        registry._register_serializer_doctype.assert_has_calls(call_list)

    def test_doctypes_for_index_method(self):
        registry = SearchRegistry('search.tests.mocks')
        registry.register(('MockSerializer',))
        doc_types = registry.get_doctypes_for_index('testindex')

        self.assertIn(MockDocType, doc_types)
        self.assertEqual(len(doc_types), 1)

    def test_get_serializer_for_model_method_with_label(self):
        registry = SearchRegistry('search.tests.mocks')
        registry.register(('MockSerializer',))
        MockSerializer = getattr(registry._serializer_module, 'MockSerializer', None)

        serializer = registry.get_serializer_for_model('search.MockModel')
        self.assertEqual(serializer, MockSerializer)

    def test_get_serializer_for_model_method_with_class(self):
        registry = SearchRegistry('search.tests.mocks')
        registry.register(('MockSerializer',))

        self.assertEqual(MockModel._meta.label, 'search.MockModel')

        MockSerializer = getattr(registry._serializer_module, 'MockSerializer', None)
        serializer = registry.get_serializer_for_model(MockModel)
        self.assertEqual(serializer, MockSerializer)
