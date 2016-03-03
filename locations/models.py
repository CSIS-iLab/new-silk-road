from django.db import models
from django.contrib.postgres.fields import ArrayField
from iso3166 import countries

COUNTRY_CHOICES = tuple((int(c.numeric), c.name) for c in countries)


class CountryField(models.PositiveSmallIntegerField):

    def __init__(self, *args, **kwargs):
        kwargs['choices'] = COUNTRY_CHOICES
        super(CountryField, self).__init__(*args, **kwargs)


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
    lon = models.FloatField(blank=True, null=True, help_text="Defines a geographic longitude")
    lat = models.FloatField(blank=True, null=True, help_text="Defines a geographic latitude")

    def __str__(self):
        return self.label
