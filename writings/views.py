from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from .models import (
    Category,
    Entry,
)


class CategoryDetailView(DetailView):
    model = Category


class CategoryListView(ListView):
    model = Category


class EntryDetailView(DetailView):
    queryset = Entry.objects.filter(published=True)


class EntryListView(ListView):
    queryset = Entry.objects.filter(published=True)
    paginate_by = 50
