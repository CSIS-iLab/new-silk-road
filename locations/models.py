from django.contrib.gis.db import models
from django.contrib.postgres.fields import JSONField
import uuid


class GeometryRecord(models.Model):
    label = models.CharField(max_length=100)
    attributes = JSONField(blank=True, default=dict)
    geom = None

    def __str__(self):
        if self.label:
            return self.label
        src = self.attributes.get('source')
        if src:
            return src
        return self.geom.wkt[:40]


class PointGeometry(GeometryRecord):
    geom = models.PointField()

    class Meta:
        verbose_name = 'point'

    @property
    def latitude(self):
        return self.geom.y

    @property
    def longitude(self):
        return self.geom.x


class LineStringGeometry(GeometryRecord):
    geom = models.LineStringField()

    class Meta:
        verbose_name = 'line'


class PolygonGeometry(GeometryRecord):
    geom = models.PolygonField()

    class Meta:
        verbose_name = 'polygon'


class MultiGeometry(GeometryRecord):
    geom = models.GeometryCollectionField()

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
    countries = models.ManyToManyField('Country')

    def __str__(self):
        return self.name


class Place(models.Model):
    """Describes a place, broadly or specifically"""
    label = models.CharField(max_length=100)
    city = models.CharField(blank=True, max_length=100)
    country = models.ForeignKey('Country')
    location = models.ForeignKey('PointGeometry', blank=True, null=True,
                                 verbose_name="geographic location")

    def __str__(self):
        return self.label


class Country(models.Model):
    name = models.CharField('Display name', max_length=200)
    numeric = models.PositiveSmallIntegerField(unique=True, help_text='ISO 3166 numeric')
    alpha_3 = models.CharField(max_length=3, unique=True, help_text='ISO 3166 alpha-3 name')

    class Meta:
        verbose_name_plural = 'countries'
        ordering = ('name',)

    def __str__(self):
        return self.name
