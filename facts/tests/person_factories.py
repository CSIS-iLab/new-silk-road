import factory


class PersonFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.Person'

    given_name = factory.Sequence(lambda n: 'Test %s' % n)
    additional_name = ''
    family_name = 'Person'

    image = None

    description = ''

    published = True
