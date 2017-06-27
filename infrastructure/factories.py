import factory

from .models import Project


class ProjectFactory(factory.Factory):
    class Meta:
        model = Project

    name = factory.Sequence(lambda n: 'Project %d' % n)
    slug = factory.Sequence(lambda n: 'Project%d' % n)
