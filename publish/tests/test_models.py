from django.conf import settings
from django.test import TestCase

from .factories import ConcretePublishableModel, ConcretePublishableFactory, setupModels
from ..models import PublishableQuerySet


class PublishableTestCase(TestCase):
    """Test case for the Publishable abstract model."""
    def setUp(self):
        """Since Publishable is abstract, we need to set up a concrete model to test it."""
        super().setUp()
        # Set up the ConcretePublishableModel
        setupModels(ConcretePublishableModel)
        # Create a ConcretePublishableModel object to be used in the tests
        self.object_class = ConcretePublishableModel
        self.object = ConcretePublishableFactory()

    def test_model_fields(self):
        """
        Tests the default fields for the Temporal and Publishable models.

        We are able to test both, since the Publishable model inherits from the
        Temporal model.
        """
        self.assertFalse(self.object.published)
        original_update_time = self.object.updated_at
        # Save the object
        self.object.save()
        # The update_at field has been changed
        self.object.refresh_from_db()
        self.assertTrue(self.object.updated_at > original_update_time)

    def test_manager_used(self):
        """
        The Publishable model uses the PublishableQuerySet.

        The Publishable model (and as a result the ConcretePublishableModel)
        is using the PublishableQuerySet as its queryset class.
        """
        self.assertEqual(self.object_class.objects._queryset_class, PublishableQuerySet)

    def test_publishable_queryset(self):
        """Test the PublishableQuerySet, which is used as the queryset for the Publishable model."""
        unpublished = self.object
        published = ConcretePublishableFactory(published=True)

        qs = PublishableQuerySet(self.object_class)
        # Currently, there are 2 objects, 1 published and 1 unpublished
        self.assertEqual(self.object_class.objects.count(), 2)
        self.assertEqual(
            set(self.object_class.objects.filter(published=True)),
            set([published])
        )
        self.assertEqual(
            set(self.object_class.objects.filter(published=False)),
            set([unpublished])
        )

        with self.subTest('unpublished() method'):
            # The .unpublished() method returns all the unpublished objects
            self.assertEqual(
                set(qs.unpublished()),
                set(self.object_class.objects.filter(published=False))
            )

        with self.subTest('published() method with PUBLISH_FILTER_ENABLED==True'):
            # The .published() method returns all the published objects when
            # PUBLISH_FILTER_ENABLED is True
            self.assertTrue(settings.PUBLISH_FILTER_ENABLED)
            self.assertEqual(
                set(qs.published()),
                set(self.object_class.objects.filter(published=True))
            )

        with self.subTest('published() method with PUBLISH_FILTER_ENABLED==False'):
            # The .published() method returns all of the objects when
            # PUBLISH_FILTER_ENABLED is False
            with self.settings(PUBLISH_FILTER_ENABLED=False):
                self.assertEqual(
                    set(qs.published()),
                    set(self.object_class.objects.all())
                )
