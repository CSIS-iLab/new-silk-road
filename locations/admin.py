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


admin.site.register(GeoPoint, LeafletGeoAdmin)
admin.site.register(GeoRegion, LeafletGeoAdmin)
admin.site.register(Place, LeafletGeoAdmin)
admin.site.register(Region, RegionAdmin)
