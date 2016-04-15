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


def filter_region_json(qs, value):
    return qs.filter(attributes__region=int(value))


def filter_json_has_key(qs, value):
    return qs.filter(attributes__has_key=value)


class LocationGeometryFilterBase(GeoFilterSet):
    label = django_filters.CharFilter(name='label', lookup_expr='iexact')
    label__contains = django_filters.CharFilter(name='label', lookup_expr='icontains')

    name = django_filters.CharFilter(name='attributes__name', lookup_expr='exact')
    layer = django_filters.CharFilter(name='attributes__layer', lookup_expr='exact')
    region = django_filters.NumberFilter(name='attributes__region', action=filter_region_json)
    # FIXME: has_key/filter_json_has_key messes up all queries.
    # has_key = django_filters.CharFilter(name='attributes', action=filter_json_has_key)


class LineStringGeometryFilter(LocationGeometryFilterBase):
    class Meta:
        model = LineStringGeometry


class PointGeometryFilter(LocationGeometryFilterBase):
    class Meta:
        model = PointGeometry


class PolygonGeometryFilter(LocationGeometryFilterBase):
    class Meta:
        model = PolygonGeometry
