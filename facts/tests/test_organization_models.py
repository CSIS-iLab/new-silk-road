from django.test import TestCase
from facts.models.locations import COUNTRY_CHOICES
from .organization_factories import (
    OrganizationFactory,
    CompanyFactory, CompanyRelationFactory,
    FinancingOrganizationFactory, FinancingRelationFactory,
    GovernmentFactory, GovernmentRelationFactory,
    MilitaryFactory, MilitaryRelationFactory,
    MultilateralFactory, MultilateralRelationFactory,
    NGOFactory, NGORelationFactory,
    PoliticalFactory, PoliticalRelationFactory,
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


class GovernmentTestCase(TestCase):

    def test_government_has_country(self):
        obj = GovernmentFactory(country=COUNTRY_CHOICES[0][0])

        self.assertEqual(obj.get_country_display(), COUNTRY_CHOICES[0][1])


class FinancingOrganizationTestCase(TestCase):

    def test_organization_has_capital(self):
        obj = FinancingOrganizationFactory(approved_capital=1000000000)

        self.assertEqual(obj.approved_capital, 1000000000)


class RelationsTestCase(TestCase):
    pass


def create_relational_test_method(objfac, relfac, right_factories):
    def test_relation_method(self):
        obj = objfac()
        for num, rfactory in enumerate(right_factories, start=1):
            other = rfactory()

            relation = relfac(left=obj, right=other)

            self.assertIsNotNone(relation)
            self.assertIsNotNone(obj.related_organizations.all())
            self.assertEqual(obj.related_organizations.count(), num)

    return test_relation_method


def setup_relational_tests():
    object_relations = (
        (CompanyFactory, CompanyRelationFactory),
        (FinancingOrganizationFactory, FinancingRelationFactory),
        (GovernmentFactory, GovernmentRelationFactory),
        (MilitaryFactory, MilitaryRelationFactory),
        (MultilateralFactory, MultilateralRelationFactory),
        (NGOFactory, NGORelationFactory),
        (PoliticalFactory, PoliticalRelationFactory),
    )

    for obj_factory, rel_factory in object_relations:
        right_facs = [x[0] for x in object_relations if x[0] != obj_factory]

        test_method = create_relational_test_method(obj_factory, rel_factory, right_facs)
        test_name = 'test_{}_relations'.format(obj_factory._meta.model._meta.model_name)
        test_method.__name__ = test_name

        setattr(RelationsTestCase, test_name, test_method)


setup_relational_tests()
