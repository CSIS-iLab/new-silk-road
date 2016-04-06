from django.contrib.gis import admin
from django.contrib.gis import forms
from .models import (
    PointGeometry, PolygonGeometry,
    LineStringGeometry, GeometryCollection,
    Region, Place,
)
from .fields import CountryMultipleChoiceField
from leaflet.admin import LeafletGeoAdmin


class MapAdmin(LeafletGeoAdmin):
    map_width = '80%'
    save_on_top = True


class GeometryBaseAdmin(MapAdmin):
    readonly_fields = ('attributes',)

    def num_points(self, obj):
        return obj.geometry.num_points if obj.geometry else 0
    num_points.short_description = 'Number of Points'

    def num_geom(self, obj):
        return obj.geometry.num_geom if obj.geometry else 0
    num_geom.short_description = 'Number of Shapes'


class RegionForm(forms.ModelForm):
    countries = CountryMultipleChoiceField(required=False)

    class Meta:
        model = Region
        fields = '__all__'


@admin.register(Region)
class RegionAdmin(MapAdmin):
    form = RegionForm


@admin.register(PolygonGeometry)
class PolygonGeometryAdmin(GeometryBaseAdmin):
    model = PolygonGeometry
    list_display = ('label', 'num_points', 'num_geom')


@admin.register(PointGeometry)
class PointGeometryAdmin(GeometryBaseAdmin):
    model = PointGeometry
    list_display = ('label', 'latitude', 'longitude')
    readonly_fields = ('latitude', 'longitude', 'attributes')


@admin.register(LineStringGeometry)
class LineStringGeometryAdmin(GeometryBaseAdmin):
    model = LineStringGeometry
    list_display = ('__str__', 'label', 'num_points', 'num_geom',)


@admin.register(GeometryCollection)
class GeometryCollectionAdmin(admin.ModelAdmin):
    model = GeometryCollection
    save_on_top = True
    readonly_fields = ('attributes', 'geometry_count', 'geometry_type_candidate')
    list_display = ('label', 'geometry_count', 'geometry_type_candidate',)

    def geometry_count(self, obj):
        return obj.geometryrecord_set.count()

    def geometry_type_candidate(self, obj):
        record = obj.geometryrecord_set.first()
        record = record.get_georecord() if record else None
        return record.geometry.geom_type if record and record.geometry else None
    geometry_type_candidate.short_description = 'Geometry Type (estimated)'

admin.site.register(Place, LeafletGeoAdmin)
