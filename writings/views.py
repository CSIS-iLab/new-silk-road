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
from django.utils import timezone
from constance import config


class FeaturedAnalysesMixin(ContextMixin):

    def get_context_data(self, **kwargs):
        kwargs = super().get_context_data(**kwargs)
        kwargs['featured_analyses'] = None
        collection_slug = getattr(config, 'FEATURED_ANALYSES_COLLECTION', None)
        if collection_slug:
            try:
                collection = EntryCollection.objects.get(slug=collection_slug)
                collection = collection.orderedentry_set.filter(
                    entry__published=True,
                    entry__publication_date__lte=timezone.now()
                )
                if collection:
                    kwargs['featured_analyses'] = (instance.entry for instance in collection)
            except EntryCollection.DoesNotExist:
                pass
        return kwargs


class CategoryListView(ListView):
    model = Category


class EntryDetailView(DetailView):
    model = Entry

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_authenticated():
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
        if not self.request.user.is_authenticated():
            queryset = queryset.filter(published=True, publication_date__lte=timezone.now())
        return queryset


class EntryCategoryListView(EntryListView):
    template_name = 'writings/entry_category_list.html'

    def get_queryset(self):
        queryset = super().get_queryset()
        cat_slug = self.kwargs.get('slug', None)
        self.category = get_object_or_404(Category, slug=cat_slug)
        return queryset.filter(category=self.category)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['category'] = self.category

        return context


class HomeView(FeaturedAnalysesMixin, TemplateView):
    template_name = "writings/home.html"

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
