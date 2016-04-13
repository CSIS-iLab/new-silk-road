from django.conf.urls import url

from .views import (
    ProjectDetailView, ProjectListView,
    InitiativeDetailView, InitiativeListView,
)

urlpatterns = [
    url(r'^projects/(?P<slug>\S+)/$', ProjectDetailView.as_view(), name='project-detail'),
    url(r'^projects/$', ProjectListView.as_view(), name='project-list'),
    url(r'^initiatives/(?P<slug>\S+)/$', InitiativeDetailView.as_view(), name='initiative-detail'),
    url(r'^initiatives/$', InitiativeListView.as_view(), name='initiative-list'),
]
