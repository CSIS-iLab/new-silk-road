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


class LocationGeoAdmin(MapAdmin):
    readonly_fields = ('attributes',)


class RegionForm(forms.ModelForm):
    countries = CountryMultipleChoiceField(required=False)

    class Meta:
        model = Region
        fields = '__all__'


@admin.register(Region)
class RegionAdmin(MapAdmin):
    form = RegionForm


@admin.register(PolygonGeometry)
class PolygonGeometryAdmin(LocationGeoAdmin):
    model = PolygonGeometry
    list_display = ('label', 'num_points', 'num_geom')

    def num_points(self, obj):
        return obj.geometry.num_points if obj.geometry else 0
    num_points.short_description = 'Number of Points'

    def num_geom(self, obj):
        return obj.geometry.num_geom if obj.geometry else 0
    num_geom.short_description = 'Number of Shapes'


@admin.register(PointGeometry)
class PointGeometryAdmin(LocationGeoAdmin):
    model = PointGeometry
    list_display = ('label',)


@admin.register(LineStringGeometry)
class LineStringGeometryAdmin(LocationGeoAdmin):
    model = LineStringGeometry
    list_display = ('label',)


@admin.register(GeometryCollection)
class GeometryCollectionAdmin(admin.ModelAdmin):
    model = GeometryCollection
    save_on_top = True

admin.site.register(Place, LeafletGeoAdmin)
