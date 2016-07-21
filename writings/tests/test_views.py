from django.contrib.auth.models import AnonymousUser, User
from django.http import Http404
from django.test import TestCase, RequestFactory
from .factories import (
    # CategoryFactory,
    EntryFactory,
)
from writings.views import (
    EntryDetailView,
)
from faker import Faker
import pytz


class EntryDetailViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.fake = Faker()

    def test_future_publication_date_hidden_to_anonymous_users(self):
        '''Anonymous users should *not* see Entries whose published=True but have a publication_date set in the future.'''
        obj = EntryFactory.create(
            published=True,
            publication_date=self.fake.date_time_this_year(before_now=False, after_now=True, tzinfo=pytz.utc)
        )

        request = self.factory.get(obj.get_absolute_url())
        request.user = AnonymousUser()

        with self.assertRaises(Http404):
            response = EntryDetailView.as_view()(request, slug=obj.slug)
            self.assertEqual(response.status_code, 404)

    def test_future_publication_date_shown_to_authorized_users(self):
        '''Authorized users should see Entries whose published=True but have a publication_date set in the future.'''
        obj = EntryFactory.create(
            published=True,
            publication_date=self.fake.date_time_this_year(before_now=False, after_now=True, tzinfo=pytz.utc)
        )

        request = self.factory.get(obj.get_absolute_url())
        request.user = User.objects.create_user(
            username='jacob', email='jacob@fake.email', password='top_secret')

        response = EntryDetailView.as_view()(request, slug=obj.slug)
        self.assertEqual(response.status_code, 200)
