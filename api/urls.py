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
router.register(r'organizations', OrganizationViewSet, base_name='organizations')
router.register(r'projects', ProjectViewSet, base_name='projects')
router.register(r'initiatives', InitiativeViewSet, base_name='initiatives')
router.register(r'lines', LineStringGeometryViewSet, base_name='lines')
router.register(r'points', PointGeometryViewSet, base_name='points')
router.register(r'polygons', PolygonGeometryViewSet, base_name='polygons')
router.register(r'geostore-centroids', GeometryStoreCentroidViewSet, base_name='geostore-centroids')

app_name = 'api'
urlpatterns = [
    url(r'geostore/(?P<identifier>[a-f0-9-]{32,36})/?', GeometryStoreDetailView.as_view(), name='geometrystore-detail'),
    url(r'geostore/(?P<identifier>[a-f0-9-]{32,36})\.(?P<format>[a-z0-9]+)/?', GeometryStoreDetailView.as_view(), name='geometrystore-detail'),
    url(r'^project-statuses/$', ProjectStatusListView.as_view(), name='project-status-list'),
    url(r'^regions/$', RegionListView.as_view(), name='region-list'),
    url(r'^countries/$', CountryListView.as_view(), name='country-list'),
    url(r'^infrastructure-types/$', InfrastructureTypeListView.as_view(), name='infrastructure-type-list'),
    url(r'^', include(router.urls)),
]
