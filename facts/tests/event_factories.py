import factory


class EventFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.Event'

    name = factory.Sequence(lambda n: 'Test Event %s' % n)

    published = True
