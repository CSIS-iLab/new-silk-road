from django.db import models
from publish.models import Publishable
from taggit.managers import TaggableManager
from iso3166 import countries

COUNTRY_CHOICES = tuple((int(c.numeric), c.name) for c in countries)


class Region(models.Model):
    """A human-described geograhic region"""
    name = models.CharField(blank=True, max_length=100)

    def __str__(self):
        return self.name


class Place(Publishable):
    """Describes a place"""
    name = models.CharField(blank=True, max_length=100)
    lon = models.FloatField(blank=True, null=True, help_text="Defines a geographic longitude")
    lat = models.FloatField(blank=True, null=True, help_text="Defines a geographic latitude")
    country = models.PositiveSmallIntegerField(choices=COUNTRY_CHOICES, blank=True, null=True)

    tags = TaggableManager(blank=True)

    def __str__(self):
        return self.name
