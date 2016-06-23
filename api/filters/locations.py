import rest_framework_filters as filters
from django_filters.filters import UUIDFilter
from rest_framework_gis.filterset import GeoFilterSet
from locations.models import (
    LineStringGeometry,
    PointGeometry,
    PolygonGeometry,
    GeometryStore,

    Country,
    Region
)


class GeometryStoreFilter(filters.FilterSet):
    label = filters.AllLookupsFilter(name='label')
    identifier = UUIDFilter()
    project = filters.RelatedFilter(
        'api.filters.infrastructure.ProjectFilter',
        name='project',
        distinct=True
    )
    project_identifiers = filters.MethodFilter()

    def filter_project_identifiers(self, name, queryset, value):
        value_list = [v for v in value.split(',') if len(v) == 36 or len(v) == 32]
        if value_list:
            return queryset.filter(project__identifier__in=value_list)
        return queryset.none()

    class Meta:
        model = GeometryStore
        fields = ('identifier', 'project')


def filter_region_json(qs, value):
    return qs.filter(attributes__region=int(value))


def filter_json_has_key(qs, value):
    return qs.filter(attributes__has_key=value)


class LocationGeometryFilterBase(GeoFilterSet):
    label = filters.CharFilter(name='label', lookup_expr='iexact')
    label__contains = filters.CharFilter(name='label', lookup_expr='icontains')

    name = filters.CharFilter(name='attributes__name', lookup_expr='exact')
    layer = filters.CharFilter(name='attributes__layer', lookup_expr='exact')
    region = filters.NumberFilter(name='attributes__region', action=filter_region_json)
    # FIXME: has_key/filter_json_has_key messes up all queries.
    # has_key = filters.CharFilter(name='attributes', action=filter_json_has_key)


class LineStringGeometryFilter(LocationGeometryFilterBase):
    class Meta:
        model = LineStringGeometry


class PointGeometryFilter(LocationGeometryFilterBase):
    class Meta:
        model = PointGeometry


class PolygonGeometryFilter(LocationGeometryFilterBase):
    class Meta:
        model = PolygonGeometry


class CountryFilter(filters.FilterSet):
    name = filters.AllLookupsFilter(name='name')
    code = filters.AllLookupsFilter(name='alpha_3')

    class Meta:
        model = Country
        fields = ['name', 'code']


class RegionFilter(filters.FilterSet):
    name = filters.AllLookupsFilter(name='name')

    class Meta:
        model = Region
        fields = ['name']
