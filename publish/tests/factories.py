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
    """
    A function to create models specifically for the test suite.

    Use this function for setting up concrete models in the test database to
    test mixins.
    """
    with connection.schema_editor() as schema_editor:
        for model in models:
            schema_editor.create_model(model)


class ConcretePublishableModel(Publishable):
    """
    A concrete model for testing the abstract Publishable model.

    Note: this model must be instantiated by using setupModels() before any
    ConcretePublishableModel objects are created in the test database.
    """
    class Meta:
        app_label = 'publish'


class ConcretePublishableFactory(factory.django.DjangoModelFactory):
    """A factory for the ConcretePublishableModel."""
    class Meta:
        model = ConcretePublishableModel
