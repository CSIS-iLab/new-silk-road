import datetime

from django.test import TestCase
from django.db.utils import IntegrityError
from django.utils.timezone import now

from . import factories


class EntryTestCase(TestCase):

    def test_entry_auto_publication_date(self):
        """Publication date should be set on save."""

        obj = factories.EntryFactory(published=True, publication_date=None)
        self.assertIsNotNone(obj.publication_date)

    def test_entry_categories(self):
        factories.CategoryFactory.create_batch(4)
        obj = factories.EntryFactory.create(categories=factories.CategoryFactory.create_batch(2))

        self.assertEqual(obj.categories.count(), 2)

    def test_url(self):
        """Entries should know their own URL."""

        entry = factories.EntryFactory(title='My Awesome Entry')
        self.assertEqual(entry.get_absolute_url(), '/analysis/entries/my-awesome-entry/')

    def test_render_on_save(self):
        """Markdown should be rendered on save."""

        entry = factories.EntryFactory(content='**bold**', description='*blip*')
        self.assertHTMLEqual(entry.content_rendered, '<p><strong>bold</strong></p>')
        self.assertHTMLEqual(entry.description_rendered, '<p><em>blip</em></p>')

    def test_is_visible(self):
        """Only currently published entries are considered visible."""

        entry = factories.EntryFactory(published=True)
        with self.subTest('Current entry'):
            self.assertTrue(entry.is_visible())

        with self.subTest('Not published'):
            entry.published = False
            self.assertFalse(entry.is_visible())

        with self.subTest('Future entry'):
            entry.published = True
            entry.publication_date = now() + datetime.timedelta(days=7)
            self.assertFalse(entry.is_visible())

    def test_get_next(self):
        """Return the next entry by published date. Entry itself might not be visible."""

        today = now()
        earlier = now() - datetime.timedelta(hours=1)
        yesterday = now() - datetime.timedelta(days=1)
        tomorrow = now() + datetime.timedelta(days=1)

        unpublished_entry = factories.EntryFactory(published=False, publication_date=None)
        latest_entry = factories.EntryFactory(published=True, publication_date=today)
        earlier_entry = factories.EntryFactory(published=True, publication_date=earlier)
        previous_entry = factories.EntryFactory(published=True, publication_date=yesterday)
        future_entry = factories.EntryFactory(published=True, publication_date=tomorrow)

        with self.subTest('Valid next entry'):
            self.assertEqual(previous_entry.get_next_published_entry(), earlier_entry)
            self.assertEqual(earlier_entry.get_next_published_entry(), latest_entry)
            self.assertEqual(latest_entry.get_next_published_entry(), future_entry)

        with self.subTest('No next entry'):
            self.assertIsNone(unpublished_entry.get_next_published_entry())
            self.assertIsNone(future_entry.get_next_published_entry())

    def test_get_prev(self):
        """Return the previous entry by published date. Entry itself might not be visible."""

        today = now()
        earlier = now() - datetime.timedelta(hours=1)
        yesterday = now() - datetime.timedelta(days=1)
        tomorrow = now() + datetime.timedelta(days=1)

        unpublished_entry = factories.EntryFactory(published=False, publication_date=None)
        latest_entry = factories.EntryFactory(published=True, publication_date=today)
        earlier_entry = factories.EntryFactory(published=True, publication_date=earlier)
        previous_entry = factories.EntryFactory(published=True, publication_date=yesterday)
        future_entry = factories.EntryFactory(published=True, publication_date=tomorrow)

        with self.subTest('Valid previous entry'):
            self.assertEqual(future_entry.get_previous_published_entry(), latest_entry)
            self.assertEqual(latest_entry.get_previous_published_entry(), earlier_entry)
            self.assertEqual(earlier_entry.get_previous_published_entry(), previous_entry)

        with self.subTest('No previous entry'):
            self.assertIsNone(unpublished_entry.get_previous_published_entry())
            self.assertIsNone(previous_entry.get_previous_published_entry())


class EntryCollectionTestCase(TestCase):

    def test_entrycollection_fails_with_duplicate_entry(self):
        """The same entry cannot be in the same collection more than once."""
        collection = factories.EntryCollectionFactory()
        entry = factories.EntryFactory()
        factories.OrderedEntryFactory(collection=collection, entry=entry)
        with self.assertRaises(IntegrityError):
            factories.OrderedEntryFactory(collection=collection, entry=entry)

    def test_entrycollection_succeeds_with_different_order(self):
        obj = factories.CollectionWithSortedEntriesFactory.create()
        self.assertEqual(obj.entries.count(), 2)


class CategoryTestCase(TestCase):

    def test_url(self):
        """Categories should know their own URL."""

        category = factories.CategoryFactory(name='Awesome', slug='awesome')
        self.assertEqual(category.get_absolute_url(), '/analysis/categories/awesome/')

    def test_str(self):
        """Categories are represented by their name."""

        category = factories.CategoryFactory(name='Awesome', slug='awesome')
        self.assertEqual(str(category), 'Awesome')
