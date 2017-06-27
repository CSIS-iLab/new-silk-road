import factory


class PersonFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'facts.Person'

    given_name = factory.Sequence(lambda n: 'Test %s' % n)
    additional_name = ''
    family_name = 'Person'

    image = None

    @factory.lazy_attribute
    def description(self):
        fake = factory.Faker('paragraphs')
        return '\n\n'.join(fake.generate({'nb': 4}))
