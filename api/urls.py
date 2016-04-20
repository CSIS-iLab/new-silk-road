from django.conf.urls import url, include
from rest_framework import routers

from api.views import (
    # infrastructure
    ProjectViewSet,
    InitiativeViewSet,
    # locations
    LineStringGeometryViewSet,
    PointGeometryViewSet,
    PolygonGeometryViewSet,
    GeometryStoreViewSet,
    GeometryStoreCentroidViewSet
)


router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'initiatives', InitiativeViewSet)
router.register(r'lines', LineStringGeometryViewSet)
router.register(r'points', PointGeometryViewSet)
router.register(r'polygons', PolygonGeometryViewSet)
router.register(r'geostore', GeometryStoreViewSet)
router.register(r'geostore-centroids', GeometryStoreCentroidViewSet, base_name='geostore-centroids')

app_name = 'api'
urlpatterns = [
    url(r'^', include(router.urls)),
]
