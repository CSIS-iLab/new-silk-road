from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.shortcuts import get_object_or_404
from .models import (
    Category,
    Entry,
)
from django.utils import timezone


class CategoryListView(ListView):
    model = Category


class EntryDetailView(DetailView):
    model = Entry

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_authenticated():
            queryset = queryset.filter(published=True, publication_date__lte=timezone.now())
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
