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


class GovernmentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.Government'


class FinancingOrganizationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.FinancingOrganization'


class CompanyStructureFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.CompanyStructure'
