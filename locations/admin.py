from django.contrib.gis import admin
from django.contrib.gis import forms
from .models import Region, Place, GeoPoint, GeoRegion, GeoCollection
from .fields import CountryMultipleChoiceField
from leaflet.admin import LeafletGeoAdmin
from leaflet.forms.widgets import LeafletWidget


class LocationGeoAdmin(LeafletGeoAdmin):
    map_width = '80%'
    save_on_top = True


class RegionForm(forms.ModelForm):
    countries = CountryMultipleChoiceField(required=False)

    class Meta:
        model = Region
        fields = '__all__'


class RegionAdmin(LocationGeoAdmin):
    form = RegionForm


class GeoRegionAdmin(LocationGeoAdmin):
    model = GeoRegion
    list_display = ('label', 'num_points', 'num_geom')

    def num_points(self, obj):
        return obj.shape.num_points if obj.shape else 0
    num_points.short_description = 'Number of Points'

    def num_geom(self, obj):
        return obj.shape.num_geom if obj.shape else 0
    num_geom.short_description = 'Number of Shapes'


class GeoPointAdmin(LocationGeoAdmin):
    model = GeoPoint
    list_display = ('label', 'lat', 'lon')
    save_on_top = True
    modifiable = False
    map_width = '80%'


class GeoCollectionAdmin(LocationGeoAdmin):
    model = GeoCollection
    save_on_top = True

admin.site.register(GeoPoint, GeoPointAdmin)
admin.site.register(GeoRegion, GeoRegionAdmin)
admin.site.register(GeoCollection, GeoCollectionAdmin)
admin.site.register(Place, LeafletGeoAdmin)
admin.site.register(Region, RegionAdmin)
