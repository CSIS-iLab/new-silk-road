from constance import config
from django.test import TestCase
from django.urls import reverse

from facts.models.organizations import DETAIL_MODEL_NAMES
from infrastructure.models import InfrastructureType
from infrastructure.tests.factories import ProjectFactory, InfrastructureTypeFactory
from writings.tests.factories import EntryFactory, EntryCollectionFactory, OrderedEntryFactory

from . import factories


class HomeViewTestCase(TestCase):
    """Test case for the HomeView."""
    def setUp(self):
        super().setUp()
        self.url = reverse('website-home')

    def test_get_homepage(self):
        """Render the homepage."""

        with self.assertTemplateUsed('website/home.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)

    def test_partner_entry(self):
        """The most recent partner entry should be in the homepage context."""

        with self.subTest('HOMEPAGE_PARTNER_ANALYSIS_COLLECTION is set'):
            # The HOMEPAGE_PARTNER_ANALYSIS_COLLECTION setting is not '' or None
            self.assertFalse(getattr(config, 'HOMEPAGE_PARTNER_ANALYSIS_COLLECTION') in ['', None])
            # Create an EntryCollection object with HOMEPAGE_PARTNER_ANALYSIS_COLLECTION as its slug
            collection = EntryCollectionFactory()
            collection.slug = config.HOMEPAGE_PARTNER_ANALYSIS_COLLECTION
            collection.save()
            entry = EntryFactory.create(published=True)
            OrderedEntryFactory.create(collection=collection, entry=entry)
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.context['partner_entry'], entry)

        with self.subTest('HOMEPAGE_PARTNER_ANALYSIS_COLLECTION is empty string'):
            # The HOMEPAGE_PARTNER_ANALYSIS_COLLECTION setting is set to ''
            config.HOMEPAGE_PARTNER_ANALYSIS_COLLECTION = ''
            # There is an EntryCollection object with its slug equal to the
            # HOMEPAGE_PARTNER_ANALYSIS_COLLECTION setting
            collection.slug = config.HOMEPAGE_PARTNER_ANALYSIS_COLLECTION
            collection.save()
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertFalse('partner_entry' in response.context)

    def test_video_url(self):
        """The video_url shows up in the context if HOMEPAGE_VIDEO_URL starts with 'http'."""
        with self.subTest('HOMEPAGE_VIDEO_URL starts with http'):
            config.HOMEPAGE_VIDEO_URL = 'http://www.somesite.com/lkfasondfo.notafile?'
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.context['video_url'], config.HOMEPAGE_VIDEO_URL)

        with self.subTest('HOMEPAGE_VIDEO_URL does not start with http'):
            config.HOMEPAGE_VIDEO_URL = 'www.somesite.com/somepage/file.mp4'
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.context['video_url'], None)

    def test_featured_entries(self):
        """The first 4 featured entries should be in the homepage context."""

        collection = EntryCollectionFactory()
        collection.slug = config.HOMEPAGE_FEATURED_ANALYSIS_COLLECTION
        collection.save()
        entries = [EntryFactory.create(published=True) for i in range(4)]
        [OrderedEntryFactory.create(collection=collection, entry=entry) for entry in entries]
        response = self.client.get(self.url)
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
        ordered_entries = [
            OrderedEntryFactory.create(collection=collection, entry=entry) for entry in entries
        ]
        for i in range(4):
            ordered_entries[i].order = i + 1

        with self.subTest('no sponsored entry'):
            response = self.client.get(self.url)
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
        response = self.client.get(self.url)
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

    def test_methods_not_allowed(self):
        """Only GETing this view is allowed."""
        with self.subTest('using POST'):
            response = self.client.post(self.url)
            self.assertEqual(response.status_code, 405)

        with self.subTest('using PUT'):
            response = self.client.put(self.url)
            self.assertEqual(response.status_code, 405)

        with self.subTest('using PATCH'):
            response = self.client.patch(self.url)
            self.assertEqual(response.status_code, 405)

        with self.subTest('using DELETE'):
            response = self.client.delete(self.url)
            self.assertEqual(response.status_code, 405)


class DatabaseViewTestCase(TestCase):
    """Test case for the DatabaseView."""
    def setUp(self):
        super().setUp()
        self.url = reverse('database-home')

    def test_get_database_view(self):
        """Render the database view."""

        with self.assertTemplateUsed('website/database.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)

    def test_featured_items(self):
        """Test the featured_items context variable."""
        with self.subTest('No Collection objects'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.context['featured_items'], None)

        with self.subTest('No Collection object with slug matching FEATURED_DATABASE_COLLECTION'):
            # Create a Collection object whose slug does not match the
            # FEATURED_DATABASE_COLLECTION setting
            collection = factories.CollectionFactory()
            self.assertNotEqual(collection.slug, config.FEATURED_DATABASE_COLLECTION)

            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.context['featured_items'], None)

        with self.subTest('A Collection object with slug matching FEATURED_DATABASE_COLLECTION'):
            # The collection slug matches the FEATURED_DATABASE_COLLECTION setting
            collection.slug = config.FEATURED_DATABASE_COLLECTION
            collection.save()

            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.context['featured_items'], collection)

        with self.subTest('With FEATURED_DATABASE_COLLECTION set as empty string'):
            # When FEATURED_DATABASE_COLLECTION is the empty string,
            # featured_items is not in the context

            # Set the FEATURED_DATABASE_COLLECTION setting to the empty string
            config.FEATURED_DATABASE_COLLECTION = ''
            # The collection slug matches the FEATURED_DATABASE_COLLECTION setting
            collection.slug = config.FEATURED_DATABASE_COLLECTION
            collection.save()

            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.context['featured_items'], None)

    def test_organization_types(self):
        """The organization_types are the sorted DETAIL_MODEL_NAMES in the context."""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        expected = sorted(DETAIL_MODEL_NAMES.items())
        self.assertEqual(response.context['organization_types'], expected)

    def test_infrastructure_types(self):
        """The infrastructure_types are the InfrastructureType objects in the context."""
        with self.subTest('No InfrastructureType objects'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.context['infrastructure_types'].count(), 0)

        with self.subTest('Some InfrastructureType objects'):
            # Create some InfrastructureType objects
            num_infrastructuretypes = 3
            for i in range(0, num_infrastructuretypes):
                InfrastructureTypeFactory()

            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(
                set(response.context['infrastructure_types']),
                set(InfrastructureType.objects.all())
            )

    def test_methods_not_allowed(self):
        """Only GETing this view is allowed."""
        with self.subTest('using POST'):
            response = self.client.post(self.url)
            self.assertEqual(response.status_code, 405)

        with self.subTest('using PUT'):
            response = self.client.put(self.url)
            self.assertEqual(response.status_code, 405)

        with self.subTest('using PATCH'):
            response = self.client.patch(self.url)
            self.assertEqual(response.status_code, 405)

        with self.subTest('using DELETE'):
            response = self.client.delete(self.url)
            self.assertEqual(response.status_code, 405)
