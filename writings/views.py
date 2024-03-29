from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.views.generic import TemplateView
from django.views.generic.base import ContextMixin
from django.shortcuts import get_object_or_404
from .models import (
    Category,
    Entry,
    EntryCollection,
)
from taggit.models import Tag
from django.utils import timezone
from constance import config


def get_published_orderedentries_from_collection(collection):
    if isinstance(collection, EntryCollection):
        return collection.orderedentry_set.filter(
            entry__published=True,
            entry__publication_date__lte=timezone.now()
        )
    else:
        return None


class ConfiguredCollectionMixin(ContextMixin):
    context_label = None
    slug = None
    config_key = None
    collection_limit = None

    def get_config_key(self):
        if not self.config_key:  # pragma: no cover
            raise AttributeError('ConfiguredCollectionMixin must define config_key property or override get_config_key method')
        return self.config_key

    def get_slug(self):
        config_key = self.get_config_key()
        return getattr(config, config_key, None)

    def get_context_label(self):
        if not self.context_label:  # pragma: no cover
            raise AttributeError('ConfiguredCollectionMixin must define context_label property or override get_context_label method')
        return self.context_label

    def get_collection_limit(self):
        if not isinstance(self.collection_limit, int):  # pragma: no cover
            raise AttributeError('ConfiguredCollectionMixin collection_limit must be an integer')
        return self.collection_limit

    def get_context_data(self, **kwargs):
        kwargs = super().get_context_data(**kwargs)
        slug = self.get_slug()
        context_label = self.get_context_label()
        if slug and context_label:
            collection_limit = self.get_collection_limit()
            kwargs[context_label] = None
            if slug:
                try:
                    entry_list = get_published_orderedentries_from_collection(EntryCollection.objects.get(slug=slug))
                    if entry_list:
                        entry_list = entry_list.order_by('order')
                        if collection_limit:
                            entry_list = entry_list[:collection_limit]
                        kwargs[context_label] = [instance.entry for instance in entry_list]
                except EntryCollection.DoesNotExist:
                    pass
        return kwargs


class FeaturedAnalysesMixin(ConfiguredCollectionMixin):
    context_label = 'featured_analyses'
    config_key = 'FEATURED_ANALYSES_COLLECTION'
    collection_limit = 2


class FeaturedEntryMixin(FeaturedAnalysesMixin):
    featured_config_key = None

    def get_featured_config_key(self):
        if not self.featured_config_key:  # pragma: no cover
            raise AttributeError('CollectionFeaturedEntryMixin must define featured_config_key property or override get_featured_config_key method')
        return self.featured_config_key

    def get_featured_slug(self):
        config_key = self.get_featured_config_key()
        return getattr(config, config_key, None)

    def get_featured_entry_set(self):
        slug = self.get_featured_slug()

        if slug:
            try:
                entry_list = get_published_orderedentries_from_collection(EntryCollection.objects.get(slug=slug))
                if entry_list:
                    ordered_entry_set = entry_list.order_by('order')
                    return ordered_entry_set
            except EntryCollection.DoesNotExist:
                pass
        return None

    def get_context_data(self, **kwargs):
        kwargs = super().get_context_data(**kwargs)
        kwargs['featured_entry_set'] = self.get_featured_entry_set()
        if kwargs['featured_entry_set']:
            kwargs['featured_entry'] = kwargs['featured_entry_set'].first().entry
        return kwargs


class CategoryListView(ListView):
    model = Category


class EntryDetailView(DetailView):
    model = Entry

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_authenticated:
            queryset = queryset.published().filter(publication_date__lte=timezone.now())
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['entry_visible'] = (self.object.published and
                                    self.object.publication_date < timezone.now())
        return context


class EntryListView(ListView):
    model = Entry
    paginate_by = 50

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(published=True, publication_date__lte=timezone.now())
        return queryset


class EntryTagListView(EntryListView):
    template_name = 'writings/entry_tag_list.html'

    def get_queryset(self):
        queryset = super().get_queryset()
        slug = self.kwargs.get('slug', None)
        self.tag = get_object_or_404(Tag, slug=slug)
        return queryset.filter(tags__slug=self.tag.slug)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['tag'] = self.tag

        return context


class EntryCategoryListView(EntryListView):
    template_name = 'writings/entry_category_list.html'

    def get_queryset(self):
        queryset = super().get_queryset()
        cat_slug = self.kwargs.get('slug', None)
        self.category = get_object_or_404(Category, slug=cat_slug)
        return queryset.filter(categories=self.category)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['category'] = self.category

        return context


class HomeView(FeaturedEntryMixin, TemplateView):
    template_name = "writings/home.html"
    featured_config_key = 'ANALYSISPAGE_FEATURED_ANALYSIS_COLLECTION'
    collection_limit = 4

    def get_context_data(self, **kwargs):
        kwargs = super().get_context_data(**kwargs)
        featured_category_slug = getattr(config, 'FEATURED_WRITINGS_CATEGORY', None)
        category = None
        recent_entries = Entry.objects.published().filter(publication_date__lte=timezone.now())
        try:
            category = Category.objects.get(slug=featured_category_slug)
            kwargs['highlighted_entry'] = category.entries.published().filter(publication_date__lte=timezone.now()).first()
            kwargs['highlighted_category'] = category
            # Also limit recent_entries by excluding this category
            recent_entries = recent_entries.exclude(categories=category)
        except Category.DoesNotExist:
            pass

        kwargs['recent_entries'] = recent_entries[:2]
        return kwargs
