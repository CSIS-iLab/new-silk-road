from constance import config
from django.test import TestCase

from search.tests.factories import ProjectFactory, InfrastructureTypeFactory
from writings.tests.factories import EntryFactory, EntryCollectionFactory, OrderedEntryFactory


class HomepageTestCase(TestCase):
    """Functional tests of the homepage."""

    def test_get_homepage(self):
        """Render the homepage."""

        with self.assertTemplateUsed('website/home.html'):
            response = self.client.get('/')
            self.assertEqual(response.status_code, 200)

    def test_partner_entry(self):
        """The most recent partner entry should be in the homepage context."""

        collection = EntryCollectionFactory()
        collection.slug = config.HOMEPAGE_PARTNER_ANALYSIS_COLLECTION
        collection.save()
        entry = EntryFactory.create(published=True)
        OrderedEntryFactory.create(collection=collection, entry=entry)
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context['partner_entry'], entry)

    def test_featured_entries(self):
        """The first 4 featured entries should be in the homepage context."""

        collection = EntryCollectionFactory()
        collection.slug = config.HOMEPAGE_FEATURED_ANALYSIS_COLLECTION
        collection.save()
        entries = [EntryFactory.create(published=True) for i in range(4)]
        [OrderedEntryFactory.create(collection=collection, entry=entry) for entry in entries]
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        # Unzip featured entries
        entries_in_context, truncate_lengths = zip(*response.context['featured_entry_set'])
        entries_in_context = [elem.entry for elem in entries_in_context]
        for i in range(4):
            self.assertIn(entries[i], entries_in_context)
        self.assertEqual(truncate_lengths, (
            config.HOMEPAGE_ARTICLE_1_WORDS,
            config.HOMEPAGE_ARTICLE_2_WORDS,
            config.HOMEPAGE_ARTICLE_3_WORDS,
            config.HOMEPAGE_ARTICLE_4_WORDS,
        ))

    def test_sponsored_entry(self):
        """Sponsored entries should have a class indicating that they are sponsored."""

        collection = EntryCollectionFactory()
        collection.slug = config.HOMEPAGE_FEATURED_ANALYSIS_COLLECTION
        collection.save()
        entries = [EntryFactory.create(published=True) for i in range(4)]
        [OrderedEntryFactory.create(collection=collection, entry=entry) for entry in entries]

        with self.subTest('no sponsored entry'):
            response = self.client.get('/')
            self.assertNotIn('sponsored-entry', str(response.content))

        with self.subTest('entry 3 is sponsored'):
            entries[2].is_sponsored = True
            entries[2].save()
            response = self.client.get('/')
            self.assertNotIn('entry-1 sponsored-entry', str(response.content))
            self.assertIn('entry-3 sponsored-entry', str(response.content))


    def test_project_totals(self):
        """Project totals should be in the homepage context."""

        road = InfrastructureTypeFactory(name='Road', slug='road')
        rail = InfrastructureTypeFactory(name='Railroad', slug='rail')
        # Create 3 road projects
        ProjectFactory(infrastructure_type=road)
        ProjectFactory(infrastructure_type=road)
        ProjectFactory(infrastructure_type=road)
        # Create 2 rail projects
        ProjectFactory(infrastructure_type=rail)
        ProjectFactory(infrastructure_type=rail)
        # Totals should be in the response
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        expected = {
            'road': {
                'id': road.pk,
                'count': 3,
                'label': 'Road',
            },
            'rail': {
                'id': rail.pk,
                'count': 2,
                'label': 'Railroad',
            }
        }
        self.assertEqual(response.context['db_totals'], expected)
