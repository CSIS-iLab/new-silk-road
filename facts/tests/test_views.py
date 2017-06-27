from django.urls import reverse
from django.test import TestCase

from . import organization_factories as orgs
from .event_factories import EventFactory
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
        self.organization = orgs.OrganizationFactory(published=True)

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


class OrganziationListingViewsTestCase(TestCase):
    """View the various listings of organizations by type."""

    @classmethod
    def setUpTestData(cls):  # noqa
        super().setUpTestData()
        # Create organizations of different types
        cls.organization = orgs.OrganizationFactory(published=True)
        cls.company = orgs.OrganizationFactory(published=True)
        cls.company._details = orgs.CompanyDetailsFactory(organization=cls.company)
        cls.finance = orgs.OrganizationFactory(published=True)
        cls.finance._details = orgs.FinancingOrganizationDetailsFactory(organization=cls.finance)
        cls.government = orgs.OrganizationFactory(published=True)
        cls.government._details = orgs.GovernmentDetailsFactory(organization=cls.government)
        cls.military = orgs.OrganizationFactory(published=True)
        cls.military._details = orgs.MilitaryDetailsFactory(organization=cls.military)
        cls.multilateral = orgs.OrganizationFactory(published=True)
        cls.multilateral._details = orgs.MultilateralDetailsFactory(organization=cls.multilateral)
        cls.ngo = orgs.OrganizationFactory(published=True)
        cls.ngo._details = orgs.NGODetailsFactory(organization=cls.ngo)
        cls.political = orgs.OrganizationFactory(published=True)
        cls.political._details = orgs.PoliticalDetailsFactory(organization=cls.political)
        cls.all_organizations = [
            cls.organization, cls.company, cls.finance, cls.government,
            cls.military, cls.multilateral, cls.ngo, cls.political]

    def _test_organization_list(self, url_name, template_name, expected):
        """Fetch an organization listing view and assert the expected links."""

        with self.assertTemplateUsed(template_name):
            response = self.client.get(reverse(url_name))
            self.assertEqual(response.status_code, 200)
            for org in self.all_organizations:
                if org in expected:
                    self.assertContains(response, org.get_absolute_url())
                else:
                    self.assertNotContains(response, org.get_absolute_url())

    def test_get_all_organizations(self):
        """Fetch listing of all published organizations."""

        self._test_organization_list(
            url_name='facts:organization-list',
            template_name='facts/organization_list.html',
            expected=self.all_organizations)

    def test_get_companies(self):
        """Fetch listing of all published companies."""

        self._test_organization_list(
            url_name='facts:companydetails-list',
            template_name='facts/organization_list.html',
            expected=[self.company, ])

    def test_get_financing_orgs(self):
        """Fetch listing of all published financing organizations."""

        self._test_organization_list(
            url_name='facts:financingorganizationdetails-list',
            template_name='facts/organization_list.html',
            expected=[self.finance, ])

    def test_get_government_orgs(self):
        """Fetch listing of all published govenernments."""

        self._test_organization_list(
            url_name='facts:governmentdetails-list',
            template_name='facts/organization_list.html',
            expected=[self.government, ])

    def test_get_military_orgs(self):
        """Fetch listing of all published militaries."""

        self._test_organization_list(
            url_name='facts:militarydetails-list',
            template_name='facts/organization_list.html',
            expected=[self.military, ])

    def test_get_multilateral_orgs(self):
        """Fetch listing of all published multilateral organizations."""

        self._test_organization_list(
            url_name='facts:multilateraldetails-list',
            template_name='facts/organization_list.html',
            expected=[self.multilateral, ])

    def test_get_ngos(self):
        """Fetch listing of all ngos."""

        self._test_organization_list(
            url_name='facts:ngodetails-list',
            template_name='facts/organization_list.html',
            expected=[self.ngo, ])

    def test_get_political_orgs(self):
        """Fetch listing of all political organizations."""

        self._test_organization_list(
            url_name='facts:politicaldetails-list',
            template_name='facts/organization_list.html',
            expected=[self.political, ])
