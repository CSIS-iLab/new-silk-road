import pytz

from django.contrib.auth.models import AnonymousUser, User
from django.http import Http404
from django.test import TestCase, RequestFactory
from django.urls import reverse
from django.utils.timezone import now
from faker import Faker

from ..views import EntryDetailView
from . import factories


class EntryDetailViewTestCase(TestCase):

    def setUp(self):
        self.factory = RequestFactory()
        self.fake = Faker()

    def test_future_publication_date_hidden_to_anonymous_users(self):
        """Anonymous users should *not* see published Entries with a date set in the future."""

        obj = factories.EntryFactory.create(
            published=True,
            publication_date=self.fake.date_time_this_year(
                before_now=False, after_now=True, tzinfo=pytz.utc)
        )

        request = self.factory.get(obj.get_absolute_url())
        request.user = AnonymousUser()

        with self.assertRaises(Http404):
            response = EntryDetailView.as_view()(request, slug=obj.slug)
            self.assertEqual(response.status_code, 404)

    def test_future_publication_date_shown_to_authorized_users(self):
        """Authorized users should see published Entries with a date set in the future."""

        obj = factories.EntryFactory.create(
            published=True,
            publication_date=self.fake.date_time_this_year(
                before_now=False, after_now=True, tzinfo=pytz.utc)
        )

        request = self.factory.get(obj.get_absolute_url())
        request.user = User.objects.create_user(
            username='jacob', email='jacob@fake.email', password='top_secret')

        response = EntryDetailView.as_view()(request, slug=obj.slug)
        self.assertEqual(response.status_code, 200)

    def test_render_page(self):
        """Render the detail page for an entry."""

        entry = factories.EntryFactory.create(
            published=True,
            publication_date=self.fake.date_time_this_year(
                before_now=True, after_now=False, tzinfo=pytz.utc)
        )

        with self.subTest('Public user. Public post'):
            with self.assertTemplateUsed('writings/entry_detail.html'):
                response = self.client.get(entry.get_absolute_url())
                self.assertEqual(response.status_code, 200)
                self.assertTrue(response.context['entry_visible'])

        User.objects.create_user(
            username='jacob', email='jacob@fake.email', password='top_secret')
        self.client.login(username='jacob', password='top_secret')
        other = factories.EntryFactory.create(
            published=True,
            publication_date=self.fake.date_time_this_year(
                before_now=False, after_now=True, tzinfo=pytz.utc)
        )

        with self.subTest('Auth user. Private post'):
            with self.assertTemplateUsed('writings/entry_detail.html'):
                response = self.client.get(other.get_absolute_url())
                self.assertEqual(response.status_code, 200)
                self.assertFalse(response.context['entry_visible'])

        with self.subTest('Public user. Private post'):
            self.client.logout()
            response = self.client.get(other.get_absolute_url())
            self.assertEqual(response.status_code, 404)


class EntryListViewTestCase(TestCase):
    """Listing published entries."""

    @classmethod
    def setUpTestData(cls):  # noqa
        super().setUpTestData()
        fake = Faker()
        cls.entry = factories.EntryFactory(published=True)
        cls.unpublished = factories.EntryFactory(published=False)
        cls.future = factories.EntryFactory(
            published=True, publication_date=fake.date_time_this_year(
                before_now=False, after_now=True, tzinfo=pytz.utc))

    def setUp(self):
        super().setUp()
        self.url = reverse('writings:entry-list')

    def test_get_page(self):
        """Render the page to see all visible entries."""

        with self.assertTemplateUsed('writings/entry_list.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, self.entry.get_absolute_url())
            self.assertNotContains(response, self.unpublished.get_absolute_url())
            self.assertNotContains(response, self.future.get_absolute_url())

    def test_authorized_user(self):
        """Authorized users can see unpublished and future entries on this page."""

        User.objects.create_user(
            username='jacob', email='jacob@fake.email', password='top_secret')
        self.client.login(username='jacob', password='top_secret')

        with self.assertTemplateUsed('writings/entry_list.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, self.entry.get_absolute_url())
            self.assertContains(response, self.unpublished.get_absolute_url())
            self.assertContains(response, self.future.get_absolute_url())


class EntryCategoryListViewTestCase(TestCase):
    """List entries in a given category."""

    @classmethod
    def setUpTestData(cls):  # noqa
        super().setUpTestData()
        fake = Faker()
        cls.category = factories.CategoryFactory()
        cls.entry = factories.EntryFactory(published=True, categories=[cls.category, ])
        cls.other = factories.EntryFactory(published=True)
        cls.unpublished = factories.EntryFactory(published=False, categories=[cls.category, ])
        cls.future = factories.EntryFactory(
            published=True, publication_date=fake.date_time_this_year(
                before_now=False, after_now=True, tzinfo=pytz.utc), categories=[cls.category, ])

    def setUp(self):
        super().setUp()
        self.url = reverse('writings:category-detail', kwargs={'slug': self.category.slug})

    def test_get_page(self):
        """Render the page to see all visible entries."""

        with self.assertTemplateUsed('writings/entry_category_list.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.context['category'], self.category)
            self.assertContains(response, self.entry.get_absolute_url())
            self.assertNotContains(response, self.other.get_absolute_url())
            self.assertNotContains(response, self.unpublished.get_absolute_url())
            self.assertNotContains(response, self.future.get_absolute_url())

    def test_authorized_user(self):
        """Authorized users can see unpublished and future entries on this page."""

        User.objects.create_user(
            username='jacob', email='jacob@fake.email', password='top_secret')
        self.client.login(username='jacob', password='top_secret')

        with self.assertTemplateUsed('writings/entry_category_list.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, self.entry.get_absolute_url())
            self.assertNotContains(response, self.other.get_absolute_url())
            self.assertContains(response, self.unpublished.get_absolute_url())
            self.assertContains(response, self.future.get_absolute_url())

    def test_unknown_category(self):
        """Unknown category slug should return a 404."""

        url = reverse('writings:category-detail', kwargs={'slug': 'does-not-exist'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)


class EntryTagListViewTestCase(TestCase):
    """List entries with a given tag."""

    @classmethod
    def setUpTestData(cls):  # noqa
        super().setUpTestData()
        fake = Faker()
        cls.tag = factories.TagFactory()
        cls.entry = factories.EntryFactory(published=True, tags=[cls.tag, ])
        cls.other = factories.EntryFactory(published=True)
        cls.unpublished = factories.EntryFactory(published=False, tags=[cls.tag, ])
        cls.future = factories.EntryFactory(
            published=True, publication_date=fake.date_time_this_year(
                before_now=False, after_now=True, tzinfo=pytz.utc), tags=[cls.tag, ])

    def setUp(self):
        super().setUp()
        self.url = reverse('writings:entry-tag-list', kwargs={'slug': self.tag.slug})

    def test_get_page(self):
        """Render the page to see all visible entries."""

        with self.assertTemplateUsed('writings/entry_tag_list.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.context['tag'], self.tag)
            self.assertContains(response, self.entry.get_absolute_url())
            self.assertNotContains(response, self.other.get_absolute_url())
            self.assertNotContains(response, self.unpublished.get_absolute_url())
            self.assertNotContains(response, self.future.get_absolute_url())

    def test_authorized_user(self):
        """Authorized users can see unpublished and future entries on this page."""

        User.objects.create_user(
            username='jacob', email='jacob@fake.email', password='top_secret')
        self.client.login(username='jacob', password='top_secret')

        with self.assertTemplateUsed('writings/entry_tag_list.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, self.entry.get_absolute_url())
            self.assertNotContains(response, self.other.get_absolute_url())
            self.assertContains(response, self.unpublished.get_absolute_url())
            self.assertContains(response, self.future.get_absolute_url())

    def test_unknown_category(self):
        """Unknown tag slug should return a 404."""

        url = reverse('writings:entry-tag-list', kwargs={'slug': 'does-not-exist'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)


class CategoriesListViewTestCase(TestCase):
    """Show available entry categories."""

    @classmethod
    def setUpTestData(cls):  # noqa
        super().setUpTestData()
        cls.category = factories.CategoryFactory()
        cls.other = factories.CategoryFactory()

    def setUp(self):
        super().setUp()
        self.url = reverse('writings:category-list')

    def test_get_page(self):
        """Render the page to see all categories."""

        with self.assertTemplateUsed('writings/category_list.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, self.category.get_absolute_url())
            self.assertContains(response, self.other.get_absolute_url())


class AnalysisHomeViewTestCase(TestCase):
    """Show homepage with feature entries."""

    def setUp(self):
        super().setUp()
        self.url = reverse('writings:home')
        self.featured_category = factories.CategoryFactory(name='News', slug='news')
        self.featured_entry_collection = factories.EntryCollectionFactory(
            name='Analysis Page Featured Analysis', slug='analysis-page-featured-analysis')
        self.featured_analyses_collection = factories.EntryCollectionFactory(
            name='Analyses Featured', slug='analyses-featured')

    def test_get_empty(self):
        """Get page with no featured articles or existing entries."""

        self.featured_category.delete()
        self.featured_entry_collection.delete()
        self.featured_analyses_collection.delete()

        with self.assertTemplateUsed('writings/home.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertNotIn('highlighted_entry', response.context)
            self.assertNotIn('highlighted_category', response.context)
            self.assertNotIn('featured_entry', response.context)
            self.assertIsNone(response.context['featured_analyses'])

    def test_recent_entries(self):
        """Page should include the most recent two published entries."""

        entry = factories.EntryFactory(published=True)
        other = factories.EntryFactory(published=True)

        with self.assertTemplateUsed('writings/home.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.context['recent_entries']), 2)
            self.assertIn(entry, response.context['recent_entries'])
            self.assertIn(other, response.context['recent_entries'])
            self.assertContains(response, entry.get_absolute_url())
            self.assertContains(response, other.get_absolute_url())

    def test_highlighted_category(self):
        """The most recent entry from the featured category should be highlighted."""

        factories.EntryFactory(
            published=True, publication_date=now(),
            categories=[self.featured_category, ])
        factories.EntryFactory(
            published=True, publication_date=now(),
            categories=[self.featured_category, ])
        last = factories.EntryFactory(
            published=True, publication_date=now(),
            categories=[self.featured_category, ])

        with self.assertTemplateUsed('writings/home.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.context['highlighted_entry'], last)
            self.assertEqual(response.context['highlighted_category'], self.featured_category)

    def test_featured_entry(self):
        """The most recent entry from the featured collection should be hightlighted.

        This is used as the top level quote on the page.
        """

        entry = factories.EntryFactory(published=True, publication_date=now(), description='Here!')
        other = factories.EntryFactory(published=True, publication_date=now())
        factories.OrderedEntryFactory(
            entry=entry, collection=self.featured_entry_collection, order=1)
        factories.OrderedEntryFactory(
            entry=other, collection=self.featured_entry_collection, order=2)

        with self.assertTemplateUsed('writings/home.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.context['featured_entry'], entry)
            self.assertContains(response, 'Here!')

    def test_featured_analyses(self):
        """Featured analyses should be included in the template."""

        entry = factories.EntryFactory(published=True, publication_date=now(), description='Here!')
        other = factories.EntryFactory(published=True, publication_date=now())
        factories.OrderedEntryFactory(
            entry=entry, collection=self.featured_analyses_collection, order=1)
        factories.OrderedEntryFactory(
            entry=other, collection=self.featured_analyses_collection, order=2)

        with self.assertTemplateUsed('writings/home.html'):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertIn(entry, response.context['featured_analyses'])
            self.assertIn(other, response.context['featured_analyses'])
            self.assertContains(response, entry.get_absolute_url())
            self.assertContains(response, other.get_absolute_url())
