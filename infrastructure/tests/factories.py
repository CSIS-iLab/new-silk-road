import factory
import random

from django.utils.text import slugify
from django.db.models import signals

from facts.tests.organization_factories import OrganizationFactory
from finance.currency import CURRENCY_CHOICES


class InitiativeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'infrastructure.Initiative'

    name = factory.Sequence(lambda n: 'Initiative %d' % n)
    slug = factory.Sequence(lambda n: 'Initiative-%d' % n)


@factory.django.mute_signals(signals.pre_save, signals.post_save)
class InfrastructureTypeFactory(factory.django.DjangoModelFactory):
    name = factory.Faker('text', max_nb_chars=100)
    slug = factory.LazyAttribute(lambda o: slugify(o.name))

    class Meta:
        model = 'infrastructure.InfrastructureType'


@factory.django.mute_signals(signals.pre_save, signals.post_save)
class ProjectFactory(factory.django.DjangoModelFactory):
    name = factory.Sequence(lambda n: 'Project %d' % n)
    slug = factory.Sequence(lambda n: 'Project-%d' % n)
    infrastructure_type = factory.SubFactory(InfrastructureTypeFactory)
    created_at = factory.Faker('date_time')
    updated_at = factory.Faker('date_time')
    total_cost = random.randint(0, 1000000)
    total_cost_currency = random.choice(CURRENCY_CHOICES)[0]

    @factory.lazy_attribute
    def description(self):
        fake = factory.Faker('paragraphs')
        return '\n\n'.join(fake.generate({'nb': 4}))

    @factory.post_generation
    def countries(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            # A list of groups were passed in, use them
            for country in extracted:
                self.countries.add(country)

    @factory.post_generation
    def fuels(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for fuel in extracted:
                self.fuels.add(fuel)

    @factory.post_generation
    def manufacturers(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for org in extracted:
                self.manufacturers.add(org)

    @factory.post_generation
    def consultants(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for org in extracted:
                self.consultants.add(org)

    @factory.post_generation
    def implementers(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for org in extracted:
                self.implementers.add(org)

    @factory.post_generation
    def initiatives(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for initiative in extracted:
                self.initiatives.add(initiative)

    class Meta:
        model = 'infrastructure.Project'


class CuratedProjectCollectionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'infrastructure.CuratedProjectCollection'

    @factory.post_generation
    def projects(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            # A list of groups were passed in, use them
            for project in projects:
                self.projects.add(project)

    name = factory.Sequence(lambda n: 'CuratedProjectCollection %d' % n)


class InitiativeTypeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'infrastructure.InitiativeType'

    name = factory.Sequence(lambda n: 'Initiative Type %d' % n)
    slug = factory.Sequence(lambda n: 'initiative-type-%d' % n)


class ProjectFundingFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'infrastructure.ProjectFunding'

    project = factory.SubFactory(ProjectFactory)
    amount = random.randint(0, 1000000)
    currency = random.choice(CURRENCY_CHOICES)[0]

@factory.django.mute_signals(signals.pre_save, signals.post_save)
class PowerPlantFactory(factory.django.DjangoModelFactory):
    name = factory.Sequence(lambda n: 'Power Plant %d' % n)
    slug = factory.Sequence(lambda n: 'power-plant-%d' % n)

    @factory.post_generation
    def owners(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for org in extracted:
                self.owners.add(org)
    
    @factory.post_generation
    def operators(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for org in extracted:
                self.operators.add(org)
    
    @factory.post_generation
    def countries(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for country in extracted:
                self.countries.add(country)
    
    @factory.post_generation
    def regions(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for region in extracted:
                self.regions.add(region)

    class Meta:
        model = 'infrastructure.PowerPlant'

class PlantOwnerStakeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'infrastructure.PlantOwnerStake'

    power_plant = factory.SubFactory(PowerPlantFactory)
    owner = factory.SubFactory(OrganizationFactory)
    percent_owned = random.randint(0, 100)

class ProjectOwnerStakeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'infrastructure.ProjectOwnerStake'
    
    project = factory.SubFactory(ProjectFactory)
    owner = factory.SubFactory(OrganizationFactory)
    percent_owned = random.randint(0, 100)

class FuelCategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'infrastructure.FuelCategory'

    name = factory.Sequence(lambda n: 'FuelCategory %d' % n)


class FuelFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'infrastructure.Fuel'

    name = factory.Sequence(lambda n: 'Power Plant %d' % n)
    fuel_category = factory.SubFactory(FuelCategoryFactory)
