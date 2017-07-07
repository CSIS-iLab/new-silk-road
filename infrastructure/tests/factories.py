import factory


class ProjectFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'infrastructure.Project'

    name = factory.Sequence(lambda n: 'Project %d' % n)
    slug = factory.Sequence(lambda n: 'Project-%d' % n)


class InitiativeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'infrastructure.Initiative'

    name = factory.Sequence(lambda n: 'Initiative %d' % n)
    slug = factory.Sequence(lambda n: 'Initiative-%d' % n)
