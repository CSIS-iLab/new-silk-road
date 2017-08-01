import factory
import pytz

from django.utils.text import slugify


class TagFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'taggit.Tag'

    name = factory.Faker('text', max_nb_chars=100)

    @factory.post_generation
    def slug(self, create, extracted, **kwargs):
        self.slug = slugify(self.name)


class CategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'writings.Category'

    name = factory.Faker('text', max_nb_chars=40)

    @factory.post_generation
    def slug(self, create, extracted, **kwargs):
        self.slug = slugify(self.name)


class EntryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'writings.Entry'

    title = factory.Faker('text', max_nb_chars=100)
    author = factory.Faker('name')
    description = factory.Faker('paragraph')
    share_text = factory.Faker('text', max_nb_chars=140)
    # TODO: Figure out how to fake FilerImageField
    # featured_image
    publication_date = factory.Faker('date_time_this_year', tzinfo=pytz.utc)
    # NOTE: tags is taggit TaggableManager, so ???
    # tags

    @factory.lazy_attribute
    def content(self):
        fake = factory.Faker('paragraphs')
        return '\n\n'.join(fake.generate({'nb': 6}))

    @factory.post_generation
    def categories(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if extracted:
            # A list of categories were passed in, use them
            for cat in extracted:
                self.categories.add(cat)

    @factory.post_generation
    def tags(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if extracted:
            # A list of tags were passed in, use them
            for cat in extracted:
                self.tags.add(cat)

    @factory.post_generation
    def slug(self, create, extracted, **kwargs):
        self.slug = slugify(self.title)


class EntryCollectionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'writings.EntryCollection'

    name = factory.Faker('text', max_nb_chars=40)

    @factory.post_generation
    def slug(self, create, extracted, **kwargs):
        self.slug = slugify(self.name)


class OrderedEntryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'writings.OrderedEntry'

    entry = factory.SubFactory(EntryFactory)
    collection = factory.SubFactory(EntryCollectionFactory)
    order = 1


class CollectionWithSortedEntriesFactory(EntryCollectionFactory):
    entry1 = factory.RelatedFactory(OrderedEntryFactory, 'collection', entry__title='Entry 1', order=1)
    entry2 = factory.RelatedFactory(OrderedEntryFactory, 'collection', entry__title='Entry 2', order=2)
