from django.urls import reverse
from django.test import TestCase

from .person_factories import PersonFactory


class PersonDetailViewTestCase(TestCase):
    """Viewing a single person."""

    def setUp(self):
        super().setUp()
        self.person = PersonFactory()

    def test_get_person_details(self):
        """Render page details of the given person."""

        with self.assertTemplateUsed('facts/person_detail.html'):
            response = self.client.get(self.person.get_absolute_url())
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, self.person.given_name)
            self.assertContains(response, self.person.family_name)

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
        self.person = PersonFactory()
        self.other = PersonFactory()
        self.url = reverse('facts:person-list')

    def test_get_listing(self):
        """Render page people."""

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
