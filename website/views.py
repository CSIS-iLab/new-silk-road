from django.views.generic import TemplateView
from constance import config
from writings.models import EntryCollection

FEATURED_ANALYSES_COLLECTION = getattr(config, 'FEATURED_ANALYSES_COLLECTION', None)


class HomeView(TemplateView):
    template_name = "website/home.html"

    def get_context_data(self, **kwargs):
        kwargs = super().get_context_data(**kwargs)
        kwargs['featured_analyses'] = None
        if FEATURED_ANALYSES_COLLECTION:
            try:
                kwargs['featured_analyses'] = EntryCollection.objects.get(slug=FEATURED_ANALYSES_COLLECTION)
            except EntryCollection.DoesNotExist:
                pass
        return kwargs


class DatabaseView(TemplateView):
    template_name = "website/database.html"
