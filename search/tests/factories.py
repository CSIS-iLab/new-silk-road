import factory
from django.utils.text import slugify


class EntryCategoryFactory(factory.django.DjangoModelFactory):
    name = factory.Faker('text', max_nb_chars=40)

    @factory.post_generation
    def slug(self, create, extracted, **kwargs):
        self.slug = slugify(self.name)

    class Meta:
        model = 'writings.Category'


class EntryFactory(factory.django.DjangoModelFactory):
    title = factory.Faker('text', max_nb_chars=100)
    author = factory.Faker('text', max_nb_chars=100)

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

        for category in extracted:
            self.categories.add(category)

    class Meta:
        model = 'writings.Entry'


class CountryFactory(factory.django.DjangoModelFactory):
    name = factory.Faker('country')
    numeric = factory.Faker('numerify', text='###')
    alpha_3 = factory.Faker('lexify', text='???')

    class Meta:
        model = 'locations.Country'


class InfrastructureTypeFactory(factory.django.DjangoModelFactory):
    name = factory.Faker('text', max_nb_chars=100)

    class Meta:
        model = 'infrastructure.InfrastructureType'


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
