from django.contrib.gis.db import models
from django.contrib.gis.db.models import Extent, Union
from django.contrib.postgres.fields import JSONField
from django.contrib.gis.geos import Polygon, MultiPolygon, GeometryCollection
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

    class Meta:
        abstract = True


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


class GeometryStore(models.Model):
    """Providing a way to collect related geometry while still siloing by geometry type"""
    identifier = models.UUIDField(default=uuid.uuid4, editable=False)
    label = models.CharField(blank=True, max_length=400)
    attributes = JSONField(blank=True, default=dict)
    lines = models.ManyToManyField(
        'locations.LineStringGeometry',
        related_name='geostores',
        blank=True
    )
    points = models.ManyToManyField(
        'locations.PointGeometry',
        related_name='geostores',
        blank=True
    )
    polygons = models.ManyToManyField(
        'locations.PolygonGeometry',
        related_name='geostores',
        blank=True
    )
    centroid = models.PointField(blank=True, null=True, editable=False)

    def __str__(self):
        if self.label:
            return self.label
        return str(self.identifier)

    def lines_extent(self):
        agg = self.lines.aggregate(extent=Extent('geom'))
        return agg['extent']

    def multiline(self):
        return self.lines.aggregate(union=Union('geom'))['union']

    def points_extent(self):
        agg = self.points.aggregate(extent=Extent('geom'))
        return agg['extent']

    def multipoint(self):
        return self.points.aggregate(union=Union('geom'))['union']

    def polygons_extent(self):
        agg = self.polygons.aggregate(extent=Extent('geom'))
        return agg['extent']

    def multipolygon(self):
        return self.polygons.aggregate(union=Union('geom'))['union']

    def _yield_extents(self):
        if self.lines.exists():
            yield self.lines_extent()
        if self.points.exists():
            yield self.points_extent()
        if self.polygons.exists():
            yield self.polygons_extent()

    def calculate_overall_extent(self):
        polygons = (Polygon.from_bbox(box) for box in self._yield_extents())
        multi_poly = MultiPolygon(list(polygons))
        return multi_poly.extent

    def _create_collection(self):
        multis = (self.multiline(), self.multipoint(), self.multipolygon())
        coll = GeometryCollection([x for x in multis if x])
        return coll

    def _get_collection_centroid(self):
        coll = self._create_collection()
        return coll.centroid


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
