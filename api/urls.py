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
)


router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'initiatives', InitiativeViewSet)
router.register(r'lines', LineStringGeometryViewSet)
router.register(r'points', PointGeometryViewSet)
router.register(r'polygons', PolygonGeometryViewSet)
router.register(r'geostore', GeometryStoreViewSet)

app_name = 'api'
urlpatterns = [
    url(r'^', include(router.urls)),
]
