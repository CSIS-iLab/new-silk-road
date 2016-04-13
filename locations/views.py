from rest_framework import viewsets, filters
from rest_framework_gis.filters import InBBoxFilter

from .models import (
    LineStringGeometry,
    PointGeometry,
    PolygonGeometry,
    GeometryStore
)
from .serializers import (
    LineStringGeometrySerializer,
    PointGeometrySerializer,
    PolygonGeometrySerializer,
    GeometryStoreSerializer
)
from .filters import GeometryStoreFilter


# API
class LineStringGeometryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LineStringGeometry.objects.all()
    serializer_class = LineStringGeometrySerializer
    bbox_filter_field = 'geom'
    filter_backends = (InBBoxFilter,)


class PointGeometryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PointGeometry.objects.all()
    serializer_class = PointGeometrySerializer
    bbox_filter_field = 'geom'
    filter_backends = (InBBoxFilter,)


class PolygonGeometryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PolygonGeometry.objects.all()
    serializer_class = PolygonGeometrySerializer
    bbox_filter_field = 'geom'
    filter_backends = (InBBoxFilter,)


class GeometryStoreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GeometryStore.objects.all()
    lookup_field = 'identifier'
    serializer_class = GeometryStoreSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = GeometryStoreFilter
