from django.contrib.gis import admin
from .models import Region, Place, Marker


class MarkerAdmin(admin.OSMGeoAdmin):
    model = Marker


# Locations
admin.site.register(Marker, MarkerAdmin)
admin.site.register(Place, admin.OSMGeoAdmin)
admin.site.register(Region, admin.OSMGeoAdmin)
