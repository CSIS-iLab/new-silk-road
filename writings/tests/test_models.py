from django.test import TestCase
from django.db.utils import IntegrityError
from .factories import (
    CategoryFactory,
    EntryFactory,
    EntryCollectionFactory,
    OrderedEntryFactory,
    CollectionWithSortedEntriesFactory,
)


class EntryTestCase(TestCase):

    def test_entry_auto_publication_date(self):
        obj = EntryFactory.create(published=True)

        self.assertIsNotNone(obj.publication_date)

    def test_entry_categories(self):
        CategoryFactory.create_batch(4)
        obj = EntryFactory.create(categories=CategoryFactory.create_batch(2))

        self.assertEqual(obj.categories.count(), 2)


class EntryCollectionTestCase(TestCase):

    def test_entrycollection_fails_with_duplicate_entry(self):
        """The same entry cannot be in the same collection more than once."""
        collection = EntryCollectionFactory()
        entry = EntryFactory()
        OrderedEntryFactory(collection=collection, entry=entry)
        with self.assertRaises(IntegrityError):
            OrderedEntryFactory(collection=collection, entry=entry)

    def test_entrycollection_succeeds_with_different_order(self):
        obj = CollectionWithSortedEntriesFactory.create()
        self.assertEqual(obj.entries.count(), 2)
