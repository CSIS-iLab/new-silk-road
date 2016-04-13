from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import (
    LineStringGeometry,
    PointGeometry,
    PolygonGeometry,
    GeometryStore,
)


class LineStringGeometrySerializer(GeoFeatureModelSerializer):

    class Meta:
        model = LineStringGeometry
        geo_field = 'geom'


class PointGeometrySerializer(GeoFeatureModelSerializer):

    class Meta:
        model = PointGeometry
        geo_field = 'geom'


class PolygonGeometrySerializer(GeoFeatureModelSerializer):

    class Meta:
        model = PolygonGeometry
        geo_field = 'geom'


class GeometryStoreSerializer(serializers.ModelSerializer):
    lines = LineStringGeometrySerializer(many=True, read_only=True)
    points = PointGeometrySerializer(many=True, read_only=True)
    polygons = PolygonGeometrySerializer(many=True, read_only=True)

    class Meta:
        model = GeometryStore
        fields = ('identifier', 'attributes', 'lines', 'points', 'polygons')
