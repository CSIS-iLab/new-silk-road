from django.conf.urls import url

from knowledgebase.views import ArticleDetailView

urlpatterns = [
    url(r'^(?P<slug>[-\w]+)/$', ArticleDetailView.as_view(), name='article-detail'),
]
