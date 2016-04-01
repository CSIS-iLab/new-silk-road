from django.conf.urls import url

from .views import (
    ProjectDetailView,
    ProjectListView
)

urlpatterns = [
    url(r'^projects/(?P<slug>[-\w]+)/$', ProjectDetailView.as_view(), name='infrastructure-project-detail'),
    url(r'^projects/$', ProjectListView.as_view(), name='infrastructure-project-list'),
]
