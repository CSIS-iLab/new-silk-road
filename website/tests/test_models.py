from django.test import TestCase

from . import factories


class CollectionItemTestCase(TestCase):
    """Test case for the CollectionItem model."""
    def setUp(self):
        super().setUp()
        self.collection = factories.CollectionFactory()
        self.collection_item = factories.CollectionItemFactory(collection=self.collection)

    def test_str(self):
        """Test for string representation."""
        expected_str = '{} {}: "{}"'.format(
            self.collection_item.content_type.model.title(),
            self.collection_item.object_id,
            str(self.collection_item.content_object)
        )
        self.assertEqual(str(self.collection_item), expected_str)

    def test_save_updates_description_rendered(self):
        """
        Saving a CollectionItem updates its description_rendered field.

        The object's description_rendered field is the output of the object's
        description field put through markymark.render_markdown().
        """
        with self.subTest('Description is empty string'):
            self.collection_item.description = ''
            self.collection_item.description_rendered = None
            # Saving the CollectionItem updates the description_rendered
            self.collection_item.save()
            self.assertEqual(self.collection_item.description_rendered, '')

        with self.subTest('Description is text'):
            self.collection_item.description = 'This is the description'
            # The expected markdown for this description
            expected_md = '<p>{}</p>'.format(self.collection_item.description)
            self.assertNotEqual(self.collection_item.description_rendered, expected_md)
            # Saving the CollectionItem updates the description_rendered
            self.collection_item.save()
            self.assertEqual(self.collection_item.description_rendered, expected_md)

        with self.subTest('Description has markdown'):
            self.collection_item.description = 'A list:\n\n1. one\n2. **two**'
            # The expected markdown for this description
            expected_md = '<p>A list:</p>\n<ol>\n<li>one</li>\n<li><strong>two</strong></li>\n</ol>'
            self.assertNotEqual(self.collection_item.description_rendered, expected_md)
            # Saving the CollectionItem updates the description_rendered
            self.collection_item.save()
            self.assertEqual(self.collection_item.description_rendered, expected_md)


class CollectionTestCase(TestCase):
    """Test case for the Collection model."""
    def setUp(self):
        super().setUp()
        self.collection = factories.CollectionFactory()

    def test_str(self):
        """Test for string representation."""
        self.assertEqual(str(self.collection), self.collection.name)
