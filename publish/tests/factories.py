import factory

from django.contrib.auth import get_user_model
from django.db import connection

from ..models import Publishable


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    username = factory.Sequence(lambda n: 'User %d' % n)
    password = factory.Sequence(lambda n: 'password%d' % n)


def setupModels(*models):
    with connection.schema_editor() as schema_editor:
        for model in models:
            schema_editor.create_model(model)


class ConcretePublishableModel(Publishable):
    """A concrete model for testing the Publishable model; only available in the test suite."""
    class Meta:
        app_label = 'publish'


class ConcretePublishableFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = ConcretePublishableModel
