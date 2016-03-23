import factory


class OrganizationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.Organization'

    name = factory.Sequence(lambda n: 'Test Organization%s' % n)


class SubOrganizationFactory(OrganizationFactory):
    class Meta:
        model = 'facts.Organization'

    name = factory.Sequence(lambda n: 'Test Suborganization%s' % n)
    parent = factory.SubFactory(OrganizationFactory)


class OrganizationDetailFactory(factory.django.DjangoModelFactory):
    organization = factory.SubFactory(OrganizationFactory)


class GovernmentDetailsFactory(OrganizationDetailFactory):
    class Meta:
        model = 'facts.GovernmentDetails'


class FinancingOrganizationDetailsFactory(OrganizationDetailFactory):
    class Meta:
        model = 'facts.FinancingOrganizationDetails'


class CompanyStructureDetailsFactory(OrganizationDetailFactory):
    class Meta:
        model = 'facts.CompanyStructure'


class CompanyDetailsFactory(OrganizationDetailFactory):
    class Meta:
        model = 'facts.CompanyDetails'


class MultilateralDetailsFactory(OrganizationDetailFactory):
    class Meta:
        model = 'facts.MultilateralDetails'


class NGODetailsFactory(OrganizationDetailFactory):
    class Meta:
        model = 'facts.NGODetails'


class PoliticalDetailsFactory(OrganizationDetailFactory):
    class Meta:
        model = 'facts.PoliticalDetails'


class MilitaryDetailsFactory(OrganizationDetailFactory):
    class Meta:
        model = 'facts.MilitaryDetails'
