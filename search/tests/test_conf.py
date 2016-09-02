from unittest.mock import Mock, call
from search.conf import SearchConf
from .mocks import MockDocOne, MockDocTwo, MockModel
from .base import BaseSearchTestCase


class SearchConfTestCase(BaseSearchTestCase):

    def test_has_serializer_module(self):
        config = SearchConf()
        config.setup('search.tests.mocks')

        self.assertIsNotNone(config._serializer_module)

        serializer_class = getattr(config._serializer_module, 'MockSerializer', None)
        self.assertIsNotNone(serializer_class)

    def test_setup_method_calls__register_serializer_model(self):
        config = SearchConf()
        config._register_serializer_model = Mock()
        config.setup('search.tests.mocks')

        MockSerializer = getattr(config._serializer_module, 'MockSerializer', None)
        MockSerializerTwo = getattr(config._serializer_module, 'MockSerializerTwo', None)
        MockSerializerThree = getattr(config._serializer_module, 'MockSerializerThree', None)

        call_list = [call(MockSerializer), call(MockSerializerTwo), call(MockSerializerThree)]
        config._register_serializer_model.assert_has_calls(call_list)

    def test_setup_method_calls__configure_serializer_doctype(self):
        config = SearchConf()
        config._configure_serializer_doctype = Mock()
        config.setup('search.tests.mocks')

        MockSerializer = getattr(config._serializer_module, 'MockSerializer', None)
        MockSerializerTwo = getattr(config._serializer_module, 'MockSerializerTwo', None)
        MockSerializerThree = getattr(config._serializer_module, 'MockSerializerThree', None)

        from django.conf import settings
        SEARCH = getattr(settings, 'SEARCH', {})
        default_index = SEARCH['default']['index']

        call_list = [
            call(MockSerializer, default_index),
            call(MockSerializerTwo, default_index),
            call(MockSerializerThree, default_index),
        ]
        config._configure_serializer_doctype.assert_has_calls(call_list)

    def test_get_serializer_for_model_method_with_label(self):
        config = SearchConf('search.tests.mocks', auto_setup=True)
        MockSerializer = getattr(config._serializer_module, 'MockSerializer', None)

        serializer = config.get_serializer_for_model('search.MockModel')
        self.assertEqual(serializer, MockSerializer)

    def test_get_serializer_for_model_method_with_class(self):
        config = SearchConf('search.tests.mocks', auto_setup=True)

        self.assertEqual(MockModel._meta.label, 'search.MockModel')

        MockSerializer = getattr(config._serializer_module, 'MockSerializer', None)
        serializer = config.get_serializer_for_model(MockModel)

        self.assertEqual(serializer, MockSerializer)

    def test_get_serializer_for_model_method_with_nonexistent_model(self):
        config = SearchConf('search.tests.mocks', auto_setup=True)

        with self.assertRaises(LookupError):
            config.get_serializer_for_model('search.ModelThatDoesNotExist')

    def test_get_serializer_for_model_method_with_unrelated_model(self):
        config = SearchConf('search.tests.mocks', auto_setup=True)
        with self.assertRaises(LookupError):
            config.get_serializer_for_model('search.MockUnserializedModel')

    def test_get_registered_models_method(self):
        config = SearchConf('search.tests.mocks', auto_setup=True)

        model_list = config.get_registered_models()
        self.assertIsNotNone(model_list)
        self.assertIn('search.MockModel', model_list)

    def test_get_registered_models_method_with_concrete_model(self):
        config = SearchConf('search.tests.mocks')
        config.setup()

        model_list = config.get_registered_models()
        self.assertIsNotNone(model_list)
        self.assertIsInstance(model_list, list)
        self.assertIn('search.MockModel', model_list)

    def test_get_doctype_for_model_method(self):
        config = SearchConf('search.tests.mocks')
        config.setup()

        DoctypeClass = config.get_doctype_for_model('search.MockModel')
        self.assertEqual(DoctypeClass, MockDocOne)

    def test_has_default_settings(self):
        config = SearchConf()
        config.setup()

        self.assertIsInstance(config._settings, dict)
        self.assertIn('default', config._settings)
        self.assertIn('index', config._settings['default'])
        self.assertIn('connections', config._settings['default'])
        self.assertIsInstance(config._settings['default']['connections'], dict)

    def test__doctype_lookup(self):
        config = SearchConf('search.tests.mocks')
        config.setup()

        from django.conf import settings
        SEARCH = getattr(settings, 'SEARCH', {})
        default_index = SEARCH['default']['index']
        expected_doctypes = set((
            'search.tests.mocks.MockDocOne',
            'search.tests.mocks.MockDocTwo',
            'search.tests.mocks.MockDocThree',
        ))

        self.assertIn(default_index, config._doctype_lookup)
        self.assertEqual(config._doctype_lookup[default_index], expected_doctypes)

    def test_setup_doctypes(self):
        config = SearchConf()
        config.setup()

        from django.conf import settings
        SEARCH = getattr(settings, 'SEARCH', {})
        default_index = SEARCH['default']['index']

        self.assertEqual(MockDocOne._doc_type.index, default_index)
        self.assertEqual(MockDocTwo._doc_type.index, default_index)
