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
    GeometryStoreViewSet,
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
router.register(r'geostore', GeometryStoreViewSet)
router.register(r'geostore-centroids', GeometryStoreCentroidViewSet, base_name='geostore-centroids')

app_name = 'api'
urlpatterns = [
    url(r'^project-statuses/$', ProjectStatusListView.as_view()),
    url(r'^regions/$', RegionListView.as_view()),
    url(r'^countries/$', CountryListView.as_view()),
    url(r'^infrastructure-types/$', InfrastructureTypeListView.as_view()),
    url(r'^', include(router.urls)),
]
