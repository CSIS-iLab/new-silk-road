from django.urls import reverse
from django.test import TestCase

from .event_factories import EventFactory
from .organization_factories import OrganizationFactory
from .person_factories import PersonFactory


class PersonDetailViewTestCase(TestCase):
    """Viewing a single person."""

    def setUp(self):
        super().setUp()
        self.person = PersonFactory(published=True)

    def test_get_person_details(self):
        """Render page details of the given person."""

        with self.assertTemplateUsed('facts/person_detail.html'):
            response = self.client.get(self.person.get_absolute_url())
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, self.person.given_name)
            self.assertContains(response, self.person.family_name)
            self.assertContains(response, self.person.description_rendered)

    def test_get_unpublished_person(self):
        """"Unpublished people should not be visible."""

        self.person.published = False
        self.person.save()

        response = self.client.get(self.person.get_absolute_url())
        self.assertEqual(response.status_code, 404)


class PersonListingViewTestCase(TestCase):
    """Viewing a list of people."""

    def setUp(self):
        super().setUp()
        self.person = PersonFactory(published=True)
        self.other = PersonFactory(published=True)
        self.url = reverse('facts:person-list')

    def test_get_listing(self):
        """Render listing of people."""

        with self.assertTemplateUsed('facts/person_list.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, self.person.get_absolute_url())
            self.assertContains(response, self.other.get_absolute_url())

    def test_get_unpublished_person(self):
        """"Unpublished people should not be visible in the listing."""

        self.person.published = False
        self.person.save()

        with self.assertTemplateUsed('facts/person_list.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertNotContains(response, self.person.get_absolute_url())
            self.assertContains(response, self.other.get_absolute_url())


class EventDetailViewTestCase(TestCase):
    """Viewing a single event page."""

    def setUp(self):
        super().setUp()
        self.event = EventFactory(published=True)

    def test_get_event_details(self):
        """Render the event detail page."""

        with self.assertTemplateUsed('facts/event_detail.html'):
            response = self.client.get(self.event.get_absolute_url())
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, self.event.name)
            self.assertContains(response, self.event.description_rendered)

    def test_get_unpublished_event(self):
        """Unpublished events should not be visible."""

        self.event.published = False
        self.event.save()

        response = self.client.get(self.event.get_absolute_url())
        self.assertEqual(response.status_code, 404)


class EventListingViewTestCase(TestCase):
    """Viewing a list of events."""

    def setUp(self):
        super().setUp()
        self.event = EventFactory(published=True)
        self.other = EventFactory(published=True)
        self.url = reverse('facts:event-list')

    def test_get_listing(self):
        """Render event listing."""

        with self.assertTemplateUsed('facts/event_list.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, self.event.get_absolute_url())
            self.assertContains(response, self.other.get_absolute_url())

    def test_get_unpublished_event(self):
        """"Unpublished events should not be visible in the listing."""

        self.event.published = False
        self.event.save()

        with self.assertTemplateUsed('facts/event_list.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertNotContains(response, self.event.get_absolute_url())
            self.assertContains(response, self.other.get_absolute_url())


class OrganizationDetailViewTestCase(TestCase):
    """View the details of an organization."""

    def setUp(self):
        super().setUp()
        self.organization = OrganizationFactory(published=True)

    def test_get_org_details(self):
        """Render the organziation detail page."""

        with self.assertTemplateUsed('facts/organization_detail.html'):
            response = self.client.get(self.organization.get_absolute_url())
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, self.organization.name)
            self.assertContains(response, self.organization.description_rendered)

    def test_get_unpublished_org(self):
        """Unpublished organizations should not be visible."""

        self.organization.published = False
        self.organization.save()

        response = self.client.get(self.organization.get_absolute_url())
        self.assertEqual(response.status_code, 404)
