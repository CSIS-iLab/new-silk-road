from django.utils.text import slugify
import factory

from infrastructure.tests.factories import ProjectFactory


class CollectionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'website.Collection'

    name = factory.Faker('text', max_nb_chars=40)

    @factory.post_generation
    def slug(self, create, extracted, **kwargs):
        self.slug = slugify(self.name)


class CollectionItemFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'website.CollectionItem'

    content_object = factory.SubFactory(ProjectFactory)
    collection = factory.SubFactory(CollectionFactory)
    order = 0
    description = factory.Faker('text', max_nb_chars=100)
