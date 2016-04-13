import django_filters
from rest_framework_gis.filterset import GeoFilterSet
from .models import (
    LineStringGeometry,
    PointGeometry,
    PolygonGeometry,
    GeometryStore,
)


class GeometryStoreFilter(GeoFilterSet):
    name = django_filters.CharFilter(name='attributes__name', lookup_expr='iexact')
    name__contains = django_filters.CharFilter(name='attributes__name', lookup_expr='icontains')

    class Meta:
        model = GeometryStore
        fields = ('identifier',)
