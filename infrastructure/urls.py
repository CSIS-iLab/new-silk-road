from django.conf.urls import url

from .views import (
    ProjectDetailView, ProjectListView,
    ProjectsLinesGeoJSONView, ProjectsPointsGeoJSONView, ProjectsPolygonsGeoJSONView,
    InitiativeDetailView, InitiativeListView,
)

urlpatterns = [
    url(r'^projects/(?P<slug>[-\w]+)/$', ProjectDetailView.as_view(), name='project-detail'),
    url(r'^projects/$', ProjectListView.as_view(), name='project-list'),
    url(r'^data/projects-lines.geojson$', ProjectsLinesGeoJSONView.as_view(), name='projects-lines-geojson'),
    url(r'^data/projects-points.geojson$', ProjectsPointsGeoJSONView.as_view(), name='projects-points-geojson'),
    url(r'^data/projects-polygons.geojson$', ProjectsPolygonsGeoJSONView.as_view(), name='projects-polygons-geojson'),
    url(r'^initiatives/(?P<slug>[-\w]+)/$', InitiativeDetailView.as_view(), name='initiative-detail'),
    url(r'^initiatives/$', InitiativeListView.as_view(), name='initiative-list'),
]
