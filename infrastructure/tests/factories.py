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


class PowerPlantFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'infrastructure.PowerPlant'

    name = factory.Sequence(lambda n: 'Power Plant %d' % n)
    slug = factory.Sequence(lambda n: 'power-plant-%d' % n)


class OwnerStakeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'infrastructure.OwnerStake'

    power_plant = factory.SubFactory(PowerPlantFactory)
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
