from django.contrib.syndication.views import Feed
from django.utils.html import strip_tags
from writings.models import Entry


class LatestEntriesFeed(Feed):
    title = "Reconnecting Asia"
    link = "/analysis/"
    description = "Mapping continental ambitions."

    def items(self):
        return Entry.objects.filter(published=True).order_by('-published_at')[:20]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return strip_tags(item.description_rendered)
