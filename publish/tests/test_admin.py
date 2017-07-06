from unittest import mock

from django.test import TestCase

from .factories import ConcretePublishableModel, ConcretePublishableFactory, setupModels
from ..admin import make_not_published, make_published


class SetUpConcretePublishableModelMixin(object):
    def setUp(self):
        """Set up the ConcretePublishableModel so these objects can be created in tests."""
        setupModels(ConcretePublishableModel)


class MakePublishedTestCase(SetUpConcretePublishableModelMixin, TestCase):
    """Test case for the make_published() method."""
    def test_already_published(self):
        """Call the make_published() method on already published objects."""
        # Create some published objects
        for i in range(0, 3):
            ConcretePublishableFactory(published=True)
        # Some mock objects
        mock_modeladmin = mock.Mock()
        mock_request = mock.Mock()

        # Call make_published() on the published objects
        make_published(mock_modeladmin, mock_request, ConcretePublishableModel.objects.all())

        # All of the objects are still published
        for model in ConcretePublishableModel.objects.all():
            self.assertTrue(model.published)

    def test_not_published(self):
        """Call the make_published() method on not published objects."""
        # Create some not published objects
        for i in range(0, 3):
            ConcretePublishableFactory(published=False)
        # Some mock objects
        mock_modeladmin = mock.Mock()
        mock_request = mock.Mock()

        # Call make_published() on the not published objects
        make_published(mock_modeladmin, mock_request, ConcretePublishableModel.objects.all())

        # All of the objects are now published
        for model in ConcretePublishableModel.objects.all():
            self.assertTrue(model.published)


class MakeNotPublishedTestCase(SetUpConcretePublishableModelMixin, TestCase):
    """Test case for the make_not_published() method."""
    def test_published(self):
        """Call the make_not_published() method on published objects."""
        # Create some published objects
        for i in range(0, 3):
            ConcretePublishableFactory(published=True)
        # Some mock objects
        mock_modeladmin = mock.Mock()
        mock_request = mock.Mock()

        # Call make_not_published() on the published objects
        make_not_published(mock_modeladmin, mock_request, ConcretePublishableModel.objects.all())

        # All of the objects are now not published
        for model in ConcretePublishableModel.objects.all():
            self.assertFalse(model.published)

    def test_not_published(self):
        """Call the make_published() method on not published objects."""
        # Create some not published objects
        for i in range(0, 3):
            ConcretePublishableFactory(published=False)
        # Some mock objects
        mock_modeladmin = mock.Mock()
        mock_request = mock.Mock()

        # Call make_not_published() on the not published objects
        make_not_published(mock_modeladmin, mock_request, ConcretePublishableModel.objects.all())

        # All of the objects are still not published
        for model in ConcretePublishableModel.objects.all():
            self.assertFalse(model.published)
