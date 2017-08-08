from django.test import SimpleTestCase

from search.templatetags.search_extras import modify_urlquery, facettitle


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


class FacetTitleTestCase(SimpleTestCase):

    def test_translate_characters(self):
        """Seperator characters should be translated to readable strings."""

        tests = (
            # Input, result
            ('position_set', 'Position Set'),
            ('countries.description', 'Countries Description'),
            ('foo:bar', 'Foo: Bar'),
        )
        for value, result in tests:
            with self.subTest(value):
                self.assertEqual(facettitle(value), result)

    def test_title_case(self):
        """End result should be in title case."""

        tests = (
            # Input, result
            ('name', 'Name'),
            ('Name', 'Name'),
            ('foo.bar.baz', 'Foo Bar Baz'),
            ('fOo.Bar.baZ', 'Foo Bar Baz'),
        )
        for value, result in tests:
            with self.subTest(value):
                self.assertEqual(facettitle(value), result)

    def test_remove_name(self):
        """Facet values ending with name should be trimmed when facet is plural."""

        tests = (
            # Input, result
            ('position_set.name', 'Position Set Name'),
            ('countries.name', 'Countries'),
        )
        for value, result in tests:
            with self.subTest(value):
                self.assertEqual(facettitle(value), result)
