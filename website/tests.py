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
