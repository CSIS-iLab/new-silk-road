import factory
from django.utils.text import slugify
from django.db.models import signals
import pytz


@factory.django.mute_signals(signals.pre_save, signals.post_save)
class EntryCategoryFactory(factory.django.DjangoModelFactory):
    name = factory.Faker('text', max_nb_chars=40)

    @factory.post_generation
    def slug(self, create, extracted, **kwargs):
        self.slug = slugify(self.name)

    class Meta:
        model = 'writings.Category'


@factory.django.mute_signals(signals.pre_save, signals.post_save)
class EntryFactory(factory.django.DjangoModelFactory):
    title = factory.Faker('text', max_nb_chars=100)
    author = factory.Faker('text', max_nb_chars=100)
    publication_date = factory.Faker('date_time_this_year', tzinfo=pytz.utc)

    @factory.lazy_attribute
    def content(self):
        fake = factory.Faker('paragraphs')
        return '\n\n'.join(fake.generate({'nb': 6}))

    @factory.post_generation
    def slug(self, create, extracted, **kwargs):
        self.slug = slugify(self.title)

    @factory.post_generation
    def categories(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for category in extracted:
                self.categories.add(category)

    class Meta:
        model = 'writings.Entry'


@factory.django.mute_signals(signals.pre_save, signals.post_save)
class CountryFactory(factory.django.DjangoModelFactory):
    name = factory.Faker('country')
    numeric = factory.Faker('numerify', text='###')
    alpha_3 = factory.Faker('lexify', text='???')

    class Meta:
        model = 'locations.Country'


@factory.django.mute_signals(signals.pre_save, signals.post_save)
class InfrastructureTypeFactory(factory.django.DjangoModelFactory):
    name = factory.Faker('text', max_nb_chars=100)

    class Meta:
        model = 'infrastructure.InfrastructureType'


@factory.django.mute_signals(signals.pre_save, signals.post_save)
class ProjectFactory(factory.django.DjangoModelFactory):
    name = factory.Faker('text', max_nb_chars=300)
    alternate_name = factory.Faker('text', max_nb_chars=100)
    infrastructure_type = factory.SubFactory(InfrastructureTypeFactory)
    created_at = factory.Faker('date_time')
    updated_at = factory.Faker('date_time')

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


@factory.django.mute_signals(signals.pre_save, signals.post_save)
class OrganizationFactory(factory.django.DjangoModelFactory):
    name = factory.Faker('text', max_nb_chars=100)
    countries = factory.SubFactory(CountryFactory)
    description = factory.Faker('paragraph', nb_sentences=5, variable_nb_sentences=True)

    @factory.post_generation
    def countries(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for country in extracted:
                self.countries.add(country)

    class Meta:
        model = 'facts.Organization'


@factory.django.mute_signals(signals.pre_save, signals.post_save)
class PositionFactory(factory.django.DjangoModelFactory):
    title = factory.Faker('text', max_nb_chars=80)
    organization = factory.SubFactory(OrganizationFactory)
    person = factory.SubFactory('search.tests.factories.PersonFactory')

    class Meta:
        model = 'facts.Position'


@factory.django.mute_signals(signals.pre_save, signals.post_save)
class PersonFactory(factory.django.DjangoModelFactory):
    given_name = factory.Faker('first_name')
    additional_name = factory.Faker('first_name')
    family_name = factory.Faker('last_name')
    description = factory.Faker('paragraph', nb_sentences=5, variable_nb_sentences=True)

    @factory.post_generation
    def position_set(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for position in extracted:
                # Since this is a reverse relation, we gotta do the savy-wavy stuff here?
                position.person = self
                position.organization.save()
                position.organization_id = position.organization.id
                self.position_set.add(position, bulk=False)

    class Meta:
        model = 'facts.Person'
