from django.conf.urls import url

from knowledgebase.views import ArticleDetailView, CategoryListView, CategoryDetailView

urlpatterns = [
    url(r'^categories/$', CategoryListView.as_view(), name='category-list'),
    url(r'^categories/(?P<slug>[-\w]+)/$', CategoryDetailView.as_view(), name='category-detail'),
    url(r'^(?P<slug>[-\w]+)/$', ArticleDetailView.as_view(), name='article-detail'),
]
