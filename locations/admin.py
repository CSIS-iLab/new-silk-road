from django.contrib.gis import admin
from django.contrib.gis import forms
from .models import (
    PointGeometry, PolygonGeometry,
    LineStringGeometry,
    GeometryStore,
    Region, Place,
    Country
)
from .forms import CountrySearchMultiField
from leaflet.admin import LeafletGeoAdmin


class MapAdmin(LeafletGeoAdmin):
    map_width = '80%'
    save_on_top = True


class GeometryBaseAdmin(MapAdmin):
    readonly_fields = ('attributes',)
    search_fields = ['label']

    def num_points(self, obj):
        return obj.geom.num_points if obj.geom else 0
    num_points.short_description = 'Number of Points'

    def num_geom(self, obj):
        return obj.geom.num_geom if obj.geom else 0
    num_geom.short_description = 'Number of Shapes'


class RegionForm(forms.ModelForm):
    countries = CountrySearchMultiField(
        required=False,
        queryset=Country.objects.all(),
        help_text=CountrySearchMultiField.help_text
    )

    class Meta:
        model = Region
        fields = '__all__'


@admin.register(Region)
class RegionAdmin(MapAdmin):
    form = RegionForm


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ('name', 'alpha_3', 'numeric')
    search_fields = ('name',)


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


# @admin.register(MultiGeometry)
# class GeometryCollectionAdmin(GeometryBaseAdmin):
#     save_on_top = True
#     readonly_fields = ('attributes', 'num_geom', 'num_points')
#     list_display = ('label', 'num_geom', 'num_points',)
#     search_fields = ['label']


@admin.register(GeometryStore)
class GeometryStoreAdmin(admin.ModelAdmin):
    readonly_fields = ('attributes',)
    list_display = ('identifier', 'label', 'name_attr', 'source_attr', 'center_attr')
    filter_horizontal = [
        'points',
        'lines',
        'polygons'
    ]
    search_fields = ('label', 'projects__name')

    def name_attr(self, obj):
        return obj.attributes.get('name', 'No name attribute')
    name_attr.short_description = 'Name Attribute'

    def source_attr(self, obj):
        return obj.attributes.get('source', 'No source captured')
    source_attr.short_description = 'Source Attribute'

    def center_attr(self, obj):
        return obj.centroid.wkt if obj.centroid else None
    center_attr.short_description = 'Center'


admin.site.register(Place, LeafletGeoAdmin)
