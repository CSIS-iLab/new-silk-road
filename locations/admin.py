from django.contrib.gis import admin
from django import forms
from .models import Region, Place, GeoPoint, GeoRegion
from .fields import CountryChoiceField


class RegionForm(forms.ModelForm):
    countries = CountryChoiceField(required=False)

    class Meta:
        model = Region
        fields = '__all__'


class RegionAdmin(admin.OSMGeoAdmin):
    form = RegionForm


admin.site.register(GeoPoint, admin.OSMGeoAdmin)
admin.site.register(GeoRegion, admin.OSMGeoAdmin)
admin.site.register(Place, admin.OSMGeoAdmin)
admin.site.register(Region, RegionAdmin)
