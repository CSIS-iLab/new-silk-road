from django.contrib.gis import admin
from django import forms
from .models import Region, Place, GeoPoint, GeoRegion
from .fields import CountryMultipleChoiceField
from leaflet.admin import LeafletGeoAdmin


class RegionForm(forms.ModelForm):
    countries = CountryMultipleChoiceField(required=False)

    class Meta:
        model = Region
        fields = '__all__'


class RegionAdmin(LeafletGeoAdmin):
    form = RegionForm


class GeoRegionAdmin(LeafletGeoAdmin):
    model = GeoRegion
    list_display = ('label', 'num_points', 'num_geom')
    save_on_top = True

    def num_points(self, obj):
        return obj.shape.num_points if obj.shape else 0
    num_points.short_description = 'Number of Points'

    def num_geom(self, obj):
        return obj.shape.num_geom if obj.shape else 0
    num_geom.short_description = 'Number of Shapes'


class GeoPointAdmin(LeafletGeoAdmin):
    model = GeoPoint
    list_display = ('label', 'lat', 'lon')
    save_on_top = True


admin.site.register(GeoPoint, GeoPointAdmin)
admin.site.register(GeoRegion, GeoRegionAdmin)
admin.site.register(Place, LeafletGeoAdmin)
admin.site.register(Region, RegionAdmin)
