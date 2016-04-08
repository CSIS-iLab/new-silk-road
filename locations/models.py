from django.contrib.gis.db import models
from django.contrib.postgres.fields import ArrayField, JSONField
import uuid

from iso3166 import countries

COUNTRY_CHOICES = tuple((int(c.numeric), c.apolitical_name) for c in countries)


class CountryField(models.PositiveSmallIntegerField):

    def __init__(self, *args, **kwargs):
        kwargs['choices'] = COUNTRY_CHOICES
        super(CountryField, self).__init__(*args, **kwargs)


class GeometryRecord(models.Model):
    label = models.CharField(max_length=100)
    attributes = JSONField(blank=True, default=dict)
    geometry = None

    def __str__(self):
        if self.label:
            return self.label
        src = self.attributes.get('source')
        if src:
            return src
        return self.geometry.wkt[:40]


class PointGeometry(GeometryRecord):
    geometry = models.PointField()

    class Meta:
        verbose_name = 'point'

    @property
    def latitude(self):
        return self.geometry.y

    @property
    def longitude(self):
        return self.geometry.x


class LineStringGeometry(GeometryRecord):
    geometry = models.LineStringField()

    class Meta:
        verbose_name = 'line'


class PolygonGeometry(GeometryRecord):
    geometry = models.PolygonField()

    class Meta:
        verbose_name = 'polygon'


class MultiGeometry(GeometryRecord):
    geometry = models.GeometryCollectionField()

    class Meta:
        verbose_name = 'geometry collection'


class GeometryStore(models.Model):
    """Providing a way to collect related geometry while still siloing by geometry type"""
    identifier = models.UUIDField(default=uuid.uuid4, editable=False)
    attributes = JSONField(blank=True, default=dict)
    lines = models.ManyToManyField('locations.LineStringGeometry')
    points = models.ManyToManyField('locations.PointGeometry')
    polygons = models.ManyToManyField('locations.PolygonGeometry')

    def __str__(self):
        return str(self.identifier)


class Region(models.Model):
    """A human-described region of geography or countries"""
    name = models.CharField(max_length=100)
    geography = models.ForeignKey('PolygonGeometry', blank=True, null=True)
    countries = ArrayField(
        models.PositiveSmallIntegerField(choices=COUNTRY_CHOICES),
        blank=True, null=True, default=list)

    def __str__(self):
        return self.name


class Place(models.Model):
    """Describes a place, broadly or specifically"""
    label = models.CharField(max_length=100)
    city = models.CharField(blank=True, max_length=100)
    country = CountryField()
    location = models.ForeignKey('PointGeometry', blank=True, null=True,
                                 verbose_name="geographic location")

    def __str__(self):
        return self.label
