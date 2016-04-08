from django.conf.urls import url

from .views import (
    ProjectDetailView, ProjectListView,
    InitiativeDetailView, InitiativeListView,
    # ProjectsGeoJSONView,
)

urlpatterns = [
    url(r'^projects/(?P<slug>[-\w]+)/$', ProjectDetailView.as_view(), name='infrastructure-project-detail'),
    # url(r'^projects.geojson$', ProjectsGeoJSONView.as_view(), name='infrastructure-projects-geojson'),
    url(r'^projects/$', ProjectListView.as_view(), name='infrastructure-project-list'),
    url(r'^initiatives/(?P<slug>[-\w]+)/$', InitiativeDetailView.as_view(), name='infrastructure-initiative-detail'),
    url(r'^initiatives/$', InitiativeListView.as_view(), name='infrastructure-initiative-list'),
]
