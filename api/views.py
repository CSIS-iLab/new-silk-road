from rest_framework import viewsets, filters
from rest_framework_gis.filters import InBBoxFilter

from locations.models import (
    LineStringGeometry,
    PointGeometry,
    PolygonGeometry,
    GeometryStore
)
from api.serializers.locations import (
    LineStringGeometrySerializer,
    PointGeometrySerializer,
    PolygonGeometrySerializer,
    GeometryStoreSerializer,
    GeometryStoreCentroidSerializer,
)
from api.filters.locations import (
    GeometryStoreFilter,
    LineStringGeometryFilter,
    PointGeometryFilter,
    PolygonGeometryFilter

)
from infrastructure.models import (Project, Initiative)
from api.serializers.infrastructure import (ProjectSerializer, InitiativeSerializer)
from api.filters.infrastructure import (ProjectFilter, InitiativeFilter)


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.select_related(
        'infrastructure_type',
    ).all()
    serializer_class = ProjectSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = ProjectFilter


class InitiativeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Initiative.objects.all()
    serializer_class = InitiativeSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = InitiativeFilter


# locations
class LineStringGeometryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LineStringGeometry.objects.all()
    serializer_class = LineStringGeometrySerializer
    bbox_filter_field = 'geom'
    filter_backends = (InBBoxFilter, filters.DjangoFilterBackend)
    filter_class = LineStringGeometryFilter


class PointGeometryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PointGeometry.objects.all()
    serializer_class = PointGeometrySerializer
    bbox_filter_field = 'geom'
    filter_backends = (InBBoxFilter, filters.DjangoFilterBackend)
    filter_class = PointGeometryFilter


class PolygonGeometryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PolygonGeometry.objects.all()
    serializer_class = PolygonGeometrySerializer
    bbox_filter_field = 'geom'
    filter_backends = (InBBoxFilter, filters.DjangoFilterBackend)
    filter_class = PolygonGeometryFilter


class GeometryStoreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GeometryStore.objects.all()
    lookup_field = 'identifier'
    serializer_class = GeometryStoreSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = GeometryStoreFilter
    pagination_class = None


class GeometryStoreCentroidViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GeometryStore.objects.all()
    lookup_field = 'identifier'
    serializer_class = GeometryStoreCentroidSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = GeometryStoreFilter
    pagination_class = None
