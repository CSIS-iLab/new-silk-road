from django.test import TestCase
from facts.tests.organization_factories import (
    OrganizationFactory,
    CompanyDetailsFactory,
    FinancingOrganizationDetailsFactory,
    GovernmentDetailsFactory,
    MilitaryDetailsFactory,
    # MultilateralDetailsFactory,
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
        self.assertIn('companydetails', obj.organization.get_detail_types())
        self.assertIn('Company', obj.organization.get_organization_types())


class FinancingOrganizationTestCase(TestCase):

    def test_has_capital(self):
        obj = FinancingOrganizationDetailsFactory(approved_capital=1000000000)

        self.assertEqual(obj.approved_capital, 1000000000)

    def test_organization_has_details(self):
        obj = FinancingOrganizationDetailsFactory()

        self.assertIsNotNone(obj.organization)
        self.assertIn('financingorganizationdetails', obj.organization.get_detail_types())
        self.assertIn('Financing Organization', obj.organization.get_organization_types())


class GovernmentTestCase(TestCase):

    def test_organization_has_details(self):
        obj = GovernmentDetailsFactory()

        self.assertIsNotNone(obj.organization)
        self.assertIn('governmentdetails', obj.organization.get_detail_types())
        self.assertIn('Government', obj.organization.get_organization_types())


class MilitaryDetailsTestCase(TestCase):

    def test_organization_has_details(self):
        obj = MilitaryDetailsFactory()

        self.assertIsNotNone(obj.organization)
        self.assertIn('militarydetails', obj.organization.get_detail_types())
        self.assertIn('Military', obj.organization.get_organization_types())


class NGODetailsTestCase(TestCase):

    def test_organization_has_details(self):
        obj = NGODetailsFactory()

        self.assertIsNotNone(obj.organization)
        self.assertIn('ngodetails', obj.organization.get_detail_types())
        self.assertIn('NGO', obj.organization.get_organization_types())


class PoliticalDetailsTestCase(TestCase):

    def test_organization_has_details(self):
        obj = PoliticalDetailsFactory()

        self.assertIsNotNone(obj.organization)
        self.assertIn('politicaldetails', obj.organization.get_detail_types())
        self.assertIn('Political Entity', obj.organization.get_organization_types())
