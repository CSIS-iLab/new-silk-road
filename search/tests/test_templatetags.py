from django.test import SimpleTestCase

from search.templatetags.search_extras import modify_urlquery


class ModifyURLTestCase(SimpleTestCase):

    def test_add_parameter(self):
        """Add a new query parameter."""

        result = modify_urlquery('/test/', page='1')
        self.assertEqual(result, '/test/?page=1')

    def test_add_existing_parameter(self):
        """Adding an existing parameter is a no-op."""

        result = modify_urlquery('/test/?page=1', page='1')
        self.assertEqual(result, '/test/?page=1')

    def test_modify_parameter(self):
        """Modify an existing query parameter.

        This can be done in a single usage. You need to remove then add.
        """

        result = modify_urlquery('/test/?page=1', page='1', delete=True)
        result = modify_urlquery(result, page='2')
        self.assertEqual(result, '/test/?page=2')

    def test_delete_parameter(self):
        """Remove a parameter."""

        result = modify_urlquery('/test/?page=1', page='1', delete=True)
        self.assertEqual(result, '/test/')
