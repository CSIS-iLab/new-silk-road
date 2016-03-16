from django.contrib.gis import admin
from django.contrib.gis import forms
from .models import Region, Place, GeoPoint, GeoRegion, GeoCollection
from .fields import CountryMultipleChoiceField
from leaflet.admin import LeafletGeoAdmin


class LocationGeoAdmin(LeafletGeoAdmin):
    map_width = '80%'
    save_on_top = True


class RegionForm(forms.ModelForm):
    countries = CountryMultipleChoiceField(required=False)

    class Meta:
        model = Region
        fields = '__all__'


@admin.register(Region)
class RegionAdmin(LocationGeoAdmin):
    form = RegionForm


@admin.register(GeoRegion)
class GeoRegionAdmin(LocationGeoAdmin):
    model = GeoRegion
    list_display = ('label', 'num_points', 'num_geom')

    def num_points(self, obj):
        return obj.shape.num_points if obj.shape else 0
    num_points.short_description = 'Number of Points'

    def num_geom(self, obj):
        return obj.shape.num_geom if obj.shape else 0
    num_geom.short_description = 'Number of Shapes'


@admin.register(GeoPoint)
class GeoPointAdmin(LocationGeoAdmin):
    model = GeoPoint
    list_display = ('label', 'lat', 'lon')
    save_on_top = True
    modifiable = False
    map_width = '80%'


@admin.register(GeoCollection)
class GeoCollectionAdmin(LocationGeoAdmin):
    model = GeoCollection
    save_on_top = True

admin.site.register(Place, LeafletGeoAdmin)
