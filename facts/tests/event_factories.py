import factory


class EventFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.Event'

    name = factory.Sequence(lambda n: 'Test Event %s' % n)

    @factory.lazy_attribute
    def description(self):
        fake = factory.Faker('paragraphs')
        return '\n\n'.join(fake.generate({'nb': 4}))
