from django.conf.urls import url, include
from rest_framework import routers

from api.views import (
    # facts
    OrganizationViewSet,
    # infrastructure
    ProjectViewSet,
    InitiativeViewSet,
    InfrastructureTypeListView,
    ProjectStatusListView,
    # locations
    LineStringGeometryViewSet,
    PointGeometryViewSet,
    PolygonGeometryViewSet,
    GeometryStoreDetailView,
    GeometryStoreCentroidViewSet,
    RegionListView,
    CountryListView,
)


router = routers.DefaultRouter()
router.register(r'organizations', OrganizationViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'initiatives', InitiativeViewSet)
router.register(r'lines', LineStringGeometryViewSet)
router.register(r'points', PointGeometryViewSet)
router.register(r'polygons', PolygonGeometryViewSet)
router.register(r'geostore-centroids', GeometryStoreCentroidViewSet, base_name='geostore-centroids')

app_name = 'api'
urlpatterns = [
    url(r'geostore/(?P<identifier>[a-f0-9-]{32,36})/?', GeometryStoreDetailView.as_view(), name='geometrystore-detail'),
    url(r'geostore/(?P<identifier>[a-f0-9-]{32,36})\.(?P<format>[a-z0-9]+)/?', GeometryStoreDetailView.as_view(), name='geometrystore-detail'),
    url(r'^project-statuses/$', ProjectStatusListView.as_view(), name='project-status-list'),
    url(r'^regions/$', RegionListView.as_view()),
    url(r'^countries/$', CountryListView.as_view()),
    url(r'^infrastructure-types/$', InfrastructureTypeListView.as_view()),
    url(r'^', include(router.urls)),
]
