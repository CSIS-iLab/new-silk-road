from django.test import TestCase
from locations.models import COUNTRY_CHOICES
from .organization_factories import (
    OrganizationFactory,
    CompanyDetailsFactory,
    FinancingOrganizationDetailsFactory,
    GovernmentDetailsFactory,
    MilitaryDetailsFactory,
    MultilateralDetailsFactory,
    NGODetailsFactory,
    PoliticalDetailsFactory,
)


class OrganizationTestCase(TestCase):

    def test_organization_string_is_name(self):
        obj = OrganizationFactory()

        self.assertEqual(obj.__str__(), obj.name)

    def test_organization_can_be_leaderless(self):
        obj = OrganizationFactory()

        self.assertEqual(obj.leaders.count(), 0)

    def test_organization_can_have_no_headquarters(self):
        obj = OrganizationFactory()

        self.assertIsNone(obj.headquarters)

    def test_organization_can_have_hierarchy(self):
        parent_org = OrganizationFactory()
        child_org = OrganizationFactory(parent=parent_org)
        grandchild_org = OrganizationFactory(parent=child_org)

        self.assertEqual(child_org.parent, parent_org)
        self.assertEqual(grandchild_org.parent, child_org)
        self.assertIn(grandchild_org, parent_org.get_descendants().all())


class CompanyDetailsTestCase(TestCase):

    def test_organization_has_details(self):
        obj = CompanyDetailsFactory()

        self.assertIsNotNone(obj.organization)
        self.assertTrue(hasattr(obj.organization, 'has_companydetails'))
        self.assertTrue(obj.organization.has_companydetails())


class FinancingOrganizationTestCase(TestCase):

    def test_has_capital(self):
        obj = FinancingOrganizationDetailsFactory(approved_capital=1000000000)

        self.assertEqual(obj.approved_capital, 1000000000)

    def test_organization_has_details(self):
        obj = FinancingOrganizationDetailsFactory()

        self.assertIsNotNone(obj.organization)
        self.assertTrue(hasattr(obj.organization, 'has_financingorganizationdetails'))
        self.assertTrue(obj.organization.has_financingorganizationdetails())


class GovernmentTestCase(TestCase):

    def test_government_has_country(self):
        obj = GovernmentDetailsFactory(country=COUNTRY_CHOICES[0][0])

        self.assertEqual(obj.get_country_display(), COUNTRY_CHOICES[0][1])

    def test_organization_has_details(self):
        obj = GovernmentDetailsFactory()

        self.assertIsNotNone(obj.organization)
        self.assertTrue(hasattr(obj.organization, 'has_governmentdetails'))
        self.assertTrue(obj.organization.has_governmentdetails())


class MilitaryDetailsTestCase(TestCase):

    def test_military_has_country(self):
        obj = MilitaryDetailsFactory(country=COUNTRY_CHOICES[0][0])

        self.assertEqual(obj.get_country_display(), COUNTRY_CHOICES[0][1])

    def test_organization_has_details(self):
        obj = MilitaryDetailsFactory()

        self.assertIsNotNone(obj.organization)
        self.assertTrue(hasattr(obj.organization, 'has_militarydetails'))
        self.assertTrue(obj.organization.has_militarydetails())


class NGODetailsTestCase(TestCase):

    def test_organization_has_details(self):
        obj = NGODetailsFactory()

        self.assertIsNotNone(obj.organization)
        self.assertTrue(hasattr(obj.organization, 'has_ngodetails'))
        self.assertTrue(obj.organization.has_ngodetails())


class PoliticalDetailsTestCase(TestCase):

    def test_organization_has_details(self):
        obj = PoliticalDetailsFactory()

        self.assertIsNotNone(obj.organization)
        self.assertTrue(hasattr(obj.organization, 'has_politicaldetails'))
        self.assertTrue(obj.organization.has_politicaldetails())
