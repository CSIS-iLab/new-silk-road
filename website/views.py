from django.views.generic import TemplateView
from constance import config
from writings.models import EntryCollection
from website.models import Collection
from facts.models.organizations import DETAIL_MODEL_NAMES
from infrastructure.models import InfrastructureType


class HomeView(TemplateView):
    template_name = "website/home.html"

    def get_context_data(self, **kwargs):
        kwargs = super().get_context_data(**kwargs)
        kwargs['featured_analyses'] = None
        collection_slug = getattr(config, 'FEATURED_ANALYSES_COLLECTION', None)
        if collection_slug:
            try:
                kwargs['featured_analyses'] = EntryCollection.objects.get(slug=collection_slug)
            except EntryCollection.DoesNotExist:
                pass
        return kwargs


class DatabaseView(TemplateView):
    template_name = "website/database.html"

    def get_context_data(self, **kwargs):
        kwargs = super().get_context_data(**kwargs)
        kwargs['featured_items'] = None
        kwargs['organization_types'] = sorted(DETAIL_MODEL_NAMES.items())
        kwargs['infrastructure_types'] = InfrastructureType.objects.all()
        collection_slug = getattr(config, 'FEATURED_DATABASE_COLLECTION', None)
        if collection_slug:
            try:
                kwargs['featured_items'] = Collection.objects.get(slug=collection_slug)
            except Collection.DoesNotExist:
                pass
        return kwargs
