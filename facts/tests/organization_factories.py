import factory
from facts.models.organizations import OrganizationRelationBase


class OrganizationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.Organization'

    name = factory.Sequence(lambda n: 'Test Organization%s' % n)


class SubOrganizationFactory(OrganizationFactory):
    class Meta:
        model = 'facts.Organization'

    name = factory.Sequence(lambda n: 'Test Suborganization%s' % n)
    parent = factory.SubFactory(OrganizationFactory)


class GovernmentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.Government'


class FinancingOrganizationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.FinancingOrganization'


class CompanyStructureFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.CompanyStructure'


class CompanyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.Company'


class MultilateralFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.Multilateral'


class NGOFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.NGO'


class PoliticalFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.Political'


class MilitaryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.Military'


# Relations

class OrganizationRelationBaseFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrganizationRelationBase
        abstract = True
    right = factory.SubFactory(OrganizationFactory)


class CompanyRelationFactory(OrganizationRelationBaseFactory):
    class Meta:
        model = 'facts.CompanyRelation'
    left = factory.SubFactory(CompanyFactory)


class FinancingRelationFactory(OrganizationRelationBaseFactory):
    class Meta:
        model = 'facts.FinancingRelation'
    left = factory.SubFactory(FinancingOrganizationFactory)


class GovernmentRelationFactory(OrganizationRelationBaseFactory):
    class Meta:
        model = 'facts.GovernmentRelation'
    left = factory.SubFactory(GovernmentFactory)


class MilitaryRelationFactory(OrganizationRelationBaseFactory):
    class Meta:
        model = 'facts.MilitaryRelation'
    left = factory.SubFactory(MilitaryFactory)


class MultilateralRelationFactory(OrganizationRelationBaseFactory):
    class Meta:
        model = 'facts.MultilateralRelation'
    left = factory.SubFactory(MultilateralFactory)


class NGORelationFactory(OrganizationRelationBaseFactory):
    class Meta:
        model = 'facts.NGORelation'
    left = factory.SubFactory(NGOFactory)


class PoliticalRelationFactory(OrganizationRelationBaseFactory):
    class Meta:
        model = 'facts.PoliticalRelation'
    left = factory.SubFactory(PoliticalFactory)
