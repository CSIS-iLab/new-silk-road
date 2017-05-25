from django.db.models import Count
from django.views.generic import TemplateView
from constance import config
from website.models import Collection
from facts.models.organizations import DETAIL_MODEL_NAMES
from infrastructure.models import InfrastructureType, Project
from writings.views import (FeaturedAnalysesMixin, FeaturedEntryMixin,
                            get_published_orderedentries_from_collection, )
from writings.models import EntryCollection


class HomeView(FeaturedAnalysesMixin, FeaturedEntryMixin, TemplateView):
    template_name = "website/home.html"
    featured_config_key = 'HOMEPAGE_FEATURED_ANALYSIS_COLLECTION'

    def get_context_data(self, **kwargs):
        kwargs = super().get_context_data(**kwargs)
        video_url = getattr(config, 'HOMEPAGE_VIDEO_URL', None)
        if isinstance(video_url, str) and video_url.startswith('http'):
            kwargs['video_url'] = video_url.strip()
        else:
            kwargs['video_url'] = None
        partner_slug = getattr(config, 'HOMEPAGE_PARTNER_ANALYSIS_COLLECTION', None)
        if partner_slug:
            try:
                entry_list = get_published_orderedentries_from_collection(
                        EntryCollection.objects.get(slug=partner_slug))
                if entry_list:
                    ordered_entry = entry_list.order_by('order').first()
                    kwargs['partner_entry'] = ordered_entry.entry
            except EntryCollection.DoesNotExist:
                pass
            
        # Zip the articles together with the lengths that each preview should be truncated to.
        # This also takes care of limiting the number of articles to a max of 4.
        kwargs['featured_entry_set'] = zip(kwargs['featured_entry_set'], [100, 40, 25, 25])

        # Add project stat totals
        totals = Project.objects.filter(
            infrastructure_type__isnull=False
        ).values(
            'infrastructure_type', 'infrastructure_type__name', 'infrastructure_type__slug'
        ).order_by().annotate(
            total=Count('id', distinct=True)
        )
        kwargs['db_totals'] = {
            result['infrastructure_type__slug']: {
                'id': result['infrastructure_type'],
                'count': result['total'],
                'label': result['infrastructure_type__name'],
            } for result in totals
        }
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
