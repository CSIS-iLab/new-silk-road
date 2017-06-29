import factory

from .models import Project, Initiative


class ProjectFactory(factory.Factory):
    class Meta:
        model = Project

    name = factory.Sequence(lambda n: 'Project %d' % n)
    slug = factory.Sequence(lambda n: 'Project-%d' % n)


class InitiativeFactory(factory.Factory):
    class Meta:
        model = Initiative

    name = factory.Sequence(lambda n: 'Initiative %d' % n)
    slug = factory.Sequence(lambda n: 'Initiative-%d' % n)
