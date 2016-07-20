from django.contrib.syndication.views import Feed
from django.utils.html import strip_tags
from writings.models import Entry
from django.utils import timezone


class LatestEntriesFeed(Feed):
    title = "Reconnecting Asia"
    link = "/analysis/"
    description = "Mapping continental ambitions."

    def items(self):
        return Entry.objects.filter(published=True, publication_date__lte=timezone.now()).order_by('-publication_date')[:20]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return strip_tags(item.description_rendered)
