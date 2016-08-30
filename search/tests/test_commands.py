from django.test import TestCase, override_settings
from django.core.management import call_command
from django.core.management.base import CommandError
import io
from elasticsearch_dsl import Index
from elasticsearch_dsl.connections import connections
from .settings import TEST_SEARCH


@override_settings(SEARCH=TEST_SEARCH)
class CreateIndexCommandTest(TestCase):

    def setUp(self):
        from django.conf import settings
        self.settings = getattr(settings, 'SEARCH')
        connections.create_connection('testing', **self.settings['default']['connections'])

    def test_create_index_usings_settings(self):
        out = io.StringIO()
        call_command('create_index', stdout=out)

        self.assertIn("Creating search indices from settings", out.getvalue())
        self.assertIn("Created search index '{}'".format(self.settings['default']['index']), out.getvalue())

        index = Index(self.settings['default']['index'])
        self.assertTrue(index.exists())

        index.delete()
        self.assertFalse(index.exists())

    def test_create_index_manually(self):
        out = io.StringIO()
        index_name = 'test_manually_created_index'
        call_command('create_index', index_name, stdout=out)
        self.assertIn("Created search index '{}'".format(index_name), out.getvalue())

        index = Index(index_name)
        self.assertTrue(index.exists())

        index.delete()
        self.assertFalse(index.exists())

    @override_settings(SEARCH={'default': {}})
    def test_create_index_warns_invalid_settings(self):
        '''Test that create_index logs a warning when a SEARCH setting is missing an index name'''
        out = io.StringIO()

        call_command('create_index', stdout=out)
        self.assertIn("No index specified for 'default'", out.getvalue())

    @override_settings(SEARCH=None)
    def test_create_index_errors_on_null_settings(self):
        '''Test that create_index logs a warning when a SEARCH setting is missing an index name'''
        out = io.StringIO()

        with self.assertRaises(CommandError):
            call_command('create_index', stdout=out)
