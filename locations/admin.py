from django.contrib.gis import admin
from .models import Region, Place, GeoPoint, GeoRegion


admin.site.register(GeoPoint, admin.OSMGeoAdmin)
admin.site.register(GeoRegion, admin.OSMGeoAdmin)
admin.site.register(Place, admin.OSMGeoAdmin)
admin.site.register(Region, admin.OSMGeoAdmin)
