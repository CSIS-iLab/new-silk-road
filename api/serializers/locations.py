from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from locations.models import (
    LineStringGeometry,
    PointGeometry,
    PolygonGeometry,
    GeometryStore,
)


class GeometryStoreRelatedSerializer(GeoFeatureModelSerializer):
    geostores = serializers.HyperlinkedIdentityField(
        many=True,
        read_only=True,
        lookup_field='identifier',
        view_name='api:geometrystore-detail'
    )

    class Meta:
        fields = ('geostores', 'attributes', 'label')


class LineStringGeometrySerializer(GeometryStoreRelatedSerializer):

    class Meta(GeometryStoreRelatedSerializer.Meta):
        model = LineStringGeometry
        geo_field = 'geom'


class PointGeometrySerializer(GeometryStoreRelatedSerializer):

    class Meta(GeometryStoreRelatedSerializer.Meta):
        model = PointGeometry
        geo_field = 'geom'


class PolygonGeometrySerializer(GeometryStoreRelatedSerializer):

    class Meta(GeometryStoreRelatedSerializer.Meta):
        model = PolygonGeometry
        geo_field = 'geom'


class GeometryStoreSerializer(serializers.ModelSerializer):
    lines = LineStringGeometrySerializer(many=True, read_only=True)
    points = PointGeometrySerializer(many=True, read_only=True)
    polygons = PolygonGeometrySerializer(many=True, read_only=True)

    class Meta:
        model = GeometryStore
        fields = ('identifier', 'attributes', 'lines', 'points', 'polygons')
