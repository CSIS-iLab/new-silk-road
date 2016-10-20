from django.views.generic import TemplateView
from constance import config
from website.models import Collection
from facts.models.organizations import DETAIL_MODEL_NAMES
from infrastructure.models import InfrastructureType
from writings.views import FeaturedAnalysesMixin, FeaturedEntryMixin, filter_collection_to_published
from writings.models import EntryCollection

class HomeView(FeaturedAnalysesMixin, FeaturedEntryMixin, TemplateView):
    template_name = "website/home.html"
    featured_config_key = 'HOMEPAGE_FEATURED_ANALYSIS_COLLECTION'

    def get_partner_slug(self):
        return getattr(config, 'HOMEPAGE_PARTNER_ANALYSIS_COLLECTION', None)

    def get_context_data(self, **kwargs):
        kwargs = super().get_context_data(**kwargs)
        video_url = getattr(config, 'HOMEPAGE_VIDEO_URL', None)
        kwargs['video_url'] = video_url.strip() if isinstance(video_url, str) and video_url.startswith('http') else None
        partner_slug = self.get_partner_slug()
        if partner_slug:
            try:
                collection = filter_collection_to_published(EntryCollection.objects.get(slug=partner_slug))
                if collection:
                    kwargs['partner_entry'] = collection.first().entry
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
