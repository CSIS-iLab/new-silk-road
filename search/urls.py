from django.conf.urls import url

from search.views import SearchResultsView

app_name = 'search'
urlpatterns = [
    url(r'^$', SearchResultsView.as_view(), name='results'),
]
