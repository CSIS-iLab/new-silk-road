from django.conf.urls import url
from .views import (
    CategoryListView,
    EntryDetailView,
    EntryListView,
    EntryCategoryListView,
)

app_name = 'writings'
urlpatterns = [
    url(r'^categories/(?P<slug>\S+)/$', EntryCategoryListView.as_view(), name='category-detail'),
    url(r'^categories/$', CategoryListView.as_view(), name='category-list'),
    url(r'^entries/(?P<slug>\S+)/$', EntryDetailView.as_view(), name='entry-detail'),
    url(r'^entries/$', EntryListView.as_view(), name='entry-list'),
]
