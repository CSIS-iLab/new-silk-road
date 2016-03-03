from django.contrib import admin

from .models import Region, Place

# Locations
admin.site.register(Place)
admin.site.register(Region)
