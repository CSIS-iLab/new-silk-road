from unittest.mock import Mock

from django.test import TestCase

from .. import admin, models
from . import factories


class AdminActionsTestCase(TestCase):
    """Admin actions to publish/unpublish."""

    def setUp(self):
        super().setUp()
        self.modeladmin = Mock()
        self.request = Mock()
        self.entry = factories.EntryFactory(published=True)
        self.other = factories.EntryFactory(published=True)
        self.unpublished = factories.EntryFactory(published=False)

    def test_publish_queryset(self):
        """Mark a queryset as published."""

        qs = models.Entry.objects.all()
        admin.make_published_with_date(self.modeladmin, self.request, qs)
        for entry in [self.entry, self.other, self.unpublished]:
            entry.refresh_from_db()
            with self.subTest():
                self.assertTrue(entry.published)
                self.assertIsNotNone(entry.publication_date)

    def test_unpublish_queryset(self):
        """Unpublish a set of objects."""

        qs = models.Entry.objects.all()
        admin.make_not_published_reset_date(self.modeladmin, self.request, qs)
        for entry in [self.entry, self.other, self.unpublished]:
            entry.refresh_from_db()
            with self.subTest():
                self.assertFalse(entry.published)
                self.assertIsNone(entry.publication_date)


class CategoryAdminTestCase(TestCase):
    """Admin customizations for categories."""

    def setUp(self):
        super().setUp()
        self.admin = admin.CategoryAdmin(models.Category, admin_site=Mock())

    def test_entry_count(self):
        """Display of the number of related entries."""

        category = factories.CategoryFactory()
        self.assertEqual(self.admin.entry_count(category), 0)
        factories.EntryFactory(categories=[category, ])
        self.assertEqual(self.admin.entry_count(category), 1)
        factories.EntryFactory(categories=[category, ], published=False)
        self.assertEqual(self.admin.entry_count(category), 2)


class EntryAdminTestCase(TestCase):
    """Admin customizations for entries."""

    def setUp(self):
        super().setUp()
        self.admin = admin.EntryAdmin(models.Entry, admin_site=Mock())
        self.entry = factories.EntryFactory()

    def test_categories(self):
        """Display the related categories."""

        self.assertHTMLEqual(self.admin.categories_display(self.entry), '<ul></ul>')
        category = factories.CategoryFactory(name='Test')
        self.entry.categories.add(category)
        self.assertHTMLEqual(self.admin.categories_display(self.entry), '<ul><li>Test</li></ul>')

    def test_page_link(self):
        """Link to the public page for this entry."""

        self.assertHTMLEqual(
            self.admin.page_link(self.entry),
            '<a href="{}" target="_blank">View on Site</a>'.format(self.entry.get_absolute_url()))

    def test_is_visible(self):
        """Indicator for whether the entry is visible to public vistors."""

        self.entry.published = True
        self.assertTrue(self.admin.page_is_visible(self.entry))
        self.entry.published = False
        self.assertFalse(self.admin.page_is_visible(self.entry))


class OrderedEntryInlineTestCase(TestCase):
    """Ordered entries for a given collection."""

    def setUp(self):
        super().setUp()
        self.admin = admin.OrderedEntryInline(models.EntryCollection, admin_site=Mock())
        self.collection = factories.EntryCollectionFactory()
        self.entry = factories.EntryFactory()
        self.entry_order = factories.OrderedEntryFactory(
            entry=self.entry, collection=self.collection, order=1)

    def test_entry_publication_date(self):
        """Display the publication date of the related entry."""

        self.assertEqual(
            self.admin.entry_publication_date(self.entry_order),
            self.entry.publication_date.strftime('%Y-%m-%d %H:%M:%S'))
        self.entry_order.entry.publication_date = None
        self.assertIsNone(self.admin.entry_publication_date(self.entry_order))

    def test_entry_published(self):
        """Display indication that the related entry is published."""

        self.entry_order.entry.published = True
        self.assertTrue(self.admin.entry_published(self.entry_order))
        self.entry_order.entry.published = False
        self.assertFalse(self.admin.entry_published(self.entry_order))

    def test_entry_visible(self):
        """Display indication that the related entry is visible."""

        self.entry_order.entry.published = True
        self.assertTrue(self.admin.entry_visible(self.entry_order))
        self.entry_order.entry.published = False
        self.assertFalse(self.admin.entry_visible(self.entry_order))


class EntryCollectionAdminTestCase(TestCase):
    """Customization of the entry collection in the admin."""

    def setUp(self):
        super().setUp()
        self.admin = admin.EntryCollectionAdmin(models.EntryCollection, admin_site=Mock())

    def test_entry_count(self):
        """Display of the number of related entries."""

        collection = factories.EntryCollectionFactory()
        self.assertEqual(self.admin.entry_count(collection), 0)
        entry = factories.EntryFactory()
        factories.OrderedEntryFactory(
            entry=entry, collection=collection, order=1)
        self.assertEqual(self.admin.entry_count(collection), 1)
        other = factories.EntryFactory(published=False)
        factories.OrderedEntryFactory(
            entry=other, collection=collection, order=2)
        self.assertEqual(self.admin.entry_count(collection), 2)
