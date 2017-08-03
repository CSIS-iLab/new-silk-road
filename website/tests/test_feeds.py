from datetime import timedelta
import xml

from django.contrib.sites.models import Site
from django.test import TestCase
from django.utils import timezone

from writings.tests.factories import EntryFactory
from ..feeds import LatestEntriesFeed


class LatestEntriesFeedTestCase(TestCase):
    """Test case for the LatestEntriesFeed."""
    def setUp(self):
        super().setUp()
        self.url = '/analysis/feed/'
        self.domain = Site.objects.first().domain

    def test_get_feed_info(self):
        """Verify the title, link, and description of the LatestEntriesFeed."""
        response = self.client.get(self.url)
        rss = xml.etree.ElementTree.fromstring(response.content)
        channel = rss.find("channel")
        title = channel.find("title").text
        self.assertEqual(title, LatestEntriesFeed.title)
        link = channel.find('link').text
        expected_link = 'http://{}{}'.format(self.domain, LatestEntriesFeed.link)
        self.assertEqual(link, expected_link)
        description = channel.find('description').text
        self.assertEqual(description, LatestEntriesFeed.description)

    def test_get_feed_items(self):
        """
        Verify the items in the LatestEntriesFeed.

        Only published Entry objects (with a publication_date in the past) should
        show up in the feed.
        """
        entry1 = EntryFactory(published=True)
        entry2 = EntryFactory(published=True)
        # Unpublished Entry
        EntryFactory(published=False)
        # Publication date in the future
        EntryFactory(published=True, publication_date=timezone.now() + timedelta(days=1))
        # The expected results
        expected_entries = [entry1, entry2]
        expected_titles = [entry1.title, entry2.title]
        expected_descriptions = [entry1.description, entry2.description]
        expected_links = [
            "http://example.com" + entry1.get_absolute_url(),
            "http://example.com" + entry2.get_absolute_url()
        ]

        response = self.client.get(self.url)

        rss = xml.etree.ElementTree.fromstring(response.content)
        channel = rss.find("channel")
        items = channel.findall("item")
        self.assertEqual(len(items), len(expected_entries))
        titles = [item.find("title").text for item in items]
        self.assertEqual(set(titles), set(expected_titles))
        descriptions = [item.find("description").text for item in items]
        self.assertEqual(set(descriptions), set(expected_descriptions))
        links = [item.find("link").text for item in items]
        self.assertEqual(set(links), set(expected_links))
