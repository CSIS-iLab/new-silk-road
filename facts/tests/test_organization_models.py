from django.test import TestCase
from facts.tests.organization_factories import (
    OrganizationFactory,
    CompanyDetailsFactory,
    FinancingOrganizationDetailsFactory,
    GovernmentDetailsFactory,
    MilitaryDetailsFactory,
    MultilateralDetailsFactory,
    NGODetailsFactory,
    PoliticalDetailsFactory,
    CompanyTypeFactory,
    FinancingTypeFactory,
    MultilateralTypeFactory,
    NGOTypeFactory,
    PoliticalTypeFactory,
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
        parent_org = OrganizationFactory(name='Parent')
        child_org = OrganizationFactory(parent=parent_org, name='Child')
        grandchild_org = OrganizationFactory(parent=child_org, name='Grandchild')

        # Refresh the tree state of the newly created orgs
        parent_org.refresh_from_db()
        child_org.refresh_from_db()
        grandchild_org.refresh_from_db()
        self.assertEqual(child_org.parent, parent_org)
        self.assertEqual(grandchild_org.parent, child_org)
        self.assertIn(grandchild_org, parent_org.get_descendants().all())


class CompanyDetailsTestCase(TestCase):

    def test_organization_has_details(self):
        obj = CompanyDetailsFactory()

        self.assertIsNotNone(obj.organization)
        self.assertIn('companydetails', obj.organization.get_detail_types())
        self.assertIn('Company', obj.organization.get_organization_types())

    def test_companies_can_have_type(self):
        company_type = CompanyTypeFactory(name='Trucking')
        obj = CompanyDetailsFactory(org_type=company_type)
        self.assertEqual(str(obj.org_type), 'Trucking')


class FinancingOrganizationTestCase(TestCase):

    def test_has_capital(self):
        obj = FinancingOrganizationDetailsFactory(approved_capital=1000000000)

        self.assertEqual(obj.approved_capital, 1000000000)

    def test_organization_has_details(self):
        obj = FinancingOrganizationDetailsFactory()

        self.assertIsNotNone(obj.organization)
        self.assertIn('financingorganizationdetails', obj.organization.get_detail_types())
        self.assertIn('Financing Organization', obj.organization.get_organization_types())

    def test_financing_can_have_type(self):
        finance_type = FinancingTypeFactory(name='Bank')
        obj = FinancingOrganizationDetailsFactory(org_type=finance_type)
        self.assertEqual(str(obj.org_type), 'Bank')

    def test_display_credit_ratings(self):
        """Display available credit ratings for the financing org."""

        obj = FinancingOrganizationDetailsFactory()
        with self.subTest('No ratings'):
            result = obj.get_credit_ratings_display()
            self.assertEqual(result, (None, None, None))

        # This maps to the 3rd element in MOODYS_LONG_TERM
        obj.moodys_credit_rating = 3
        with self.subTest('Moody rating'):
            result = obj.get_credit_ratings_display()
            self.assertEqual(result, ('Aa2', None, None))

        # This maps to the 2nd element in FITCH_LONG_TERM
        obj.fitch_credit_rating = 102
        with self.subTest('Fitch rating'):
            result = obj.get_credit_ratings_display()
            self.assertEqual(result, ('Aa2', 'AA+', None))

        # This maps to the 5th element in STANDARD_POORS_LONG_TERM
        obj.sp_credit_rating = 205
        with self.subTest('S&P rating'):
            result = obj.get_credit_ratings_display()
            self.assertEqual(result, ('Aa2', 'AA+', 'A+'))


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

    def test_ngos_can_have_type(self):
        ngo_type = NGOTypeFactory(name='Community Based')
        obj = NGODetailsFactory(org_type=ngo_type)
        self.assertEqual(str(obj.org_type), 'Community Based')


class PoliticalDetailsTestCase(TestCase):

    def test_organization_has_details(self):
        obj = PoliticalDetailsFactory()

        self.assertIsNotNone(obj.organization)
        self.assertIn('politicaldetails', obj.organization.get_detail_types())
        self.assertIn('Political Entity', obj.organization.get_organization_types())

    def test_political_can_have_type(self):
        political_type = PoliticalTypeFactory(name='PAC')
        obj = PoliticalDetailsFactory(org_type=political_type)
        self.assertEqual(str(obj.org_type), 'PAC')


class MultilateralDetailsTestCase(TestCase):

    def test_organization_has_details(self):
        obj = MultilateralDetailsFactory()
        self.assertIsNotNone(obj.organization)
        self.assertIn('multilateraldetails', obj.organization.get_detail_types())
        self.assertIn('Multilateral', obj.organization.get_organization_types())

    def test_multilateral_can_have_type(self):
        multi_type = MultilateralTypeFactory(name='Mega Corp')
        obj = MultilateralDetailsFactory(org_type=multi_type)
        self.assertEqual(str(obj.org_type), 'Mega Corp')
