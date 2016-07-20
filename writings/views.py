from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.shortcuts import get_object_or_404
from .models import (
    Category,
    Entry,
)


class CategoryListView(ListView):
    model = Category


class EntryDetailView(DetailView):
    queryset = Entry.objects.filter(published=True)


class EntryListView(ListView):
    queryset = Entry.objects.filter(published=True)
    paginate_by = 50


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
