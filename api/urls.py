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

geo_router = routers.DefaultRouter()
geo_router.register(r'lines', LineStringGeometryViewSet)
geo_router.register(r'points', PointGeometryViewSet)
geo_router.register(r'polygons', PolygonGeometryViewSet)
geo_router.register(r'store', GeometryStoreViewSet)


urlpatterns = [
    url(r'^geo/', include(geo_router.urls)),
    url(r'^', include(router.urls)),
]
