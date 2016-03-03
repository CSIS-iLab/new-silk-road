from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from django.core.exceptions import ValidationError

from iso3166 import countries

COUNTRY_CHOICES = tuple((int(c.numeric), c.name) for c in countries)


class CountryField(models.PositiveSmallIntegerField):

    def __init__(self, *args, **kwargs):
        kwargs['choices'] = COUNTRY_CHOICES
        super(CountryField, self).__init__(*args, **kwargs)


class Marker(models.Model):
    """Marks a point on a map"""
    label = models.CharField(max_length=100)
    lon = models.FloatField(blank=True, help_text="Defines a geographic longitude")
    lat = models.FloatField(blank=True, help_text="Defines a geographic latitude")
    point = models.PointField(blank=True)

    def _set_location_fields(self):
        if (self.lat and self.lon):
            self.point = Point(self.lat, self.lon)
        elif self.point:
            self.lat = self.point.x
            self.lon = self.point.y
        else:
            raise ValidationError('Marker have a lat/lon or a point on the map.')

    def clean(self, *args, **kwargs):
        self._set_location_fields()

    def save(self, *args, **kwargs):
        try:
            self._set_location_fields()
        except ValidationError:
            raise Exception('No location data set, unable to save.')
        super(Marker, self).save(*args, **kwargs)

    def __str__(self):
        return "Marker for '{}'".format(self.label)


class Region(models.Model):
    """A human-described geograhic region"""
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Place(models.Model):
    """Describes a place, broadly or specifically"""
    label = models.CharField(max_length=100)
    city = models.CharField(blank=True, max_length=100)
    country = CountryField()
    position = models.ForeignKey('Marker', blank=True, null=True)

    def __str__(self):
        return self.label
