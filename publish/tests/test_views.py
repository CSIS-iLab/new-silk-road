from unittest import mock

from django.contrib.auth.models import AnonymousUser
from django.test import RequestFactory, TestCase
from django.views.generic.list import ListView

from . import factories
from ..views import PublicationMixin


class PublicationMixinTestCase(TestCase):
    """Test case for the PublicationMixin."""
    def setUp(self):
        """Create a TestView that inherits from PublicationMixin."""
        super().setUp()

        class TestView(PublicationMixin, ListView):
            """Define a basic view that can used in the tests."""

        self.test_view = TestView()
        request = RequestFactory().get('test_view')
        request.user = factories.UserFactory()
        self.test_view.request = request

    @mock.patch('django.views.generic.list.ListView.get_queryset')
    def test_get_queryset_calls_super(self, mock_get_queryset):
        """Test the get_queryset() method calls the super().get_queryset() method."""
        # So far, the super().get_queryset() method has not been called
        self.assertEqual(mock_get_queryset.call_count, 0)

        self.test_view.get_queryset()

        # Now the super().get_queryset() method has been called once
        self.assertEqual(mock_get_queryset.call_count, 1)

    @mock.patch('django.views.generic.list.MultipleObjectMixin.get_queryset')
    def test_get_queryset(self, mock_get_queryset):
        """Test the PublicationMixin.get_queryset() method."""
        # The mock_get_queryset return_value
        get_queryset_return_value = mock.Mock()
        mock_get_queryset.return_value = get_queryset_return_value
        # Whenever the mock_get_queryset().published() method is called, return this value
        published_returned_value = 'Published queryset'
        mock_get_queryset.return_value.published.return_value = published_returned_value

        with self.subTest('Authenticated user and published queryset'):
            # If the user is authenticated, then queryset.published() will not be called.
            self.assertTrue(self.test_view.request.user.is_authenticated)

            result = self.test_view.get_queryset()

            # The published() method has not been called, so the get_queryset_return_value
            # is returned
            self.assertEqual(result, get_queryset_return_value)

        with self.subTest('Unauthenticated user and published queryset'):
            # If the user is not authenticated and the queryset has a 'published'
            # attribute, then queryset.published() will be called, so the
            # published_returned_value should be returned.

            # Make sure the user is not authenticated
            self.test_view.request.user = AnonymousUser()

            result = self.test_view.get_queryset()

            # The published() method has been called, and returned the rpublished_returned_value
            self.assertEqual(result, published_returned_value)
