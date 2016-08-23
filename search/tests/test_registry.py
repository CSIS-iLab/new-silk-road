from django.test import SimpleTestCase, override_settings
from unittest.mock import Mock, call
from search.registry import SearchRegistry
from search.tests.mocks import MockDocType, MockModel
from .settings import TEST_SEARCH


@override_settings(SEARCH=TEST_SEARCH)
class SearchRegistryTestCase(SimpleTestCase):

    def test_has_serializer_module(self):
        registry = SearchRegistry('search.tests.mocks')

        self.assertIsNotNone(registry._serializer_module)

        serializer_class = getattr(registry._serializer_module, 'MockSerializer', None)
        self.assertIsNotNone(serializer_class)

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

    def test_get_registered_models_method(self):
        registry = SearchRegistry('search.tests.mocks')
        registry.register(('MockSerializer',))

        model_list = registry.get_registered_models()
        self.assertIsNotNone(model_list)
        self.assertIn('search.MockModel', model_list)

    def test_get_registered_models_method_with_concrete_model(self):
        registry = SearchRegistry('search.tests.mocks')
        registry.register(('MockSerializerThree',))

        model_list = registry.get_registered_models()
        self.assertIsNotNone(model_list)
        self.assertIsInstance(model_list, list)
        self.assertIn('search.MockModel', model_list)

    def test_get_doctype_for_model_method(self):
        registry = SearchRegistry('search.tests.mocks')
        registry.register(('MockSerializerThree',))

        DoctypeClass = registry.get_doctype_for_model('search.MockModel')
        self.assertEqual(DoctypeClass, MockDocType)
