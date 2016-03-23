import factory


class OrganizationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.Organization'

    name = factory.Sequence(lambda n: 'Test Organization%s' % n)
    mission = factory.Faker('paragraph')
    # leaders = factory.SubFactory(PersonFactory)
    notes = factory.Faker('paragraph')
    # headquarters = factory.SubFactory(PlaceFactory)
    founding_date = factory.Faker('date')
    dissolution_date = factory.Faker('date')

    @factory.post_generation
    def related_organizations(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for obj in extracted:
                self.related_organizations.add(obj)

    @factory.post_generation
    def initiatives(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for obj in extracted:
                self.initiatives.add(obj)

    @factory.post_generation
    def events(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for obj in extracted:
                self.events.add(obj)


class SubOrganizationFactory(OrganizationFactory):
    class Meta:
        model = 'facts.Organization'

    name = factory.Sequence(lambda n: 'Test Suborganization%s' % n)
    parent = factory.SubFactory(OrganizationFactory)


class DetailsFactory(factory.django.DjangoModelFactory):
    organization = factory.SubFactory(OrganizationFactory)


class CompanyStructureFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.CompanyStructure'


class CompanyDetailsFactory(DetailsFactory):
    class Meta:
        model = 'facts.CompanyDetails'

    structure = factory.SubFactory(CompanyStructureFactory)
    sector = factory.Iterator(range(1, 4))
    # org_type =


class FinancingOrganizationDetailsFactory(DetailsFactory):
    class Meta:
        model = 'facts.FinancingOrganizationDetails'

    # approved_capital
    # moodys_credit_rating
    # fitch_credit_rating
    # sp_credit_rating
    # shareholder_people
    # scope_of_operations
    # procurement
    # org_type


class GovernmentDetailsFactory(DetailsFactory):
    class Meta:
        model = 'facts.GovernmentDetails'


class MilitaryDetailsFactory(DetailsFactory):
    class Meta:
        model = 'facts.MilitaryDetails'


class MultilateralDetailsFactory(DetailsFactory):
    class Meta:
        model = 'facts.MultilateralDetails'


class NGODetailsFactory(DetailsFactory):
    class Meta:
        model = 'facts.NGODetails'


class PoliticalDetailsFactory(DetailsFactory):
    class Meta:
        model = 'facts.PoliticalDetails'


class OrganizationShareholderFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.OrganizationShareholder'
    investment = factory.SubFactory(OrganizationFactory)
    shareholder = factory.SubFactory(FinancingOrganizationDetailsFactory)
    # value = Decimal


class FODetailsWithShareholdersFactory(FinancingOrganizationDetailsFactory):
    shareholder_organizations = factory.RelatedFactory(
        OrganizationShareholderFactory,
        'shareholder'
    )
