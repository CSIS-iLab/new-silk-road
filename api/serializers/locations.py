from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from locations.models import (
    LineStringGeometry,
    PointGeometry,
    PolygonGeometry,
    GeometryStore,
    Region,
    Country
)
from api.serializers.infrastructure import (ProjectNestableSerializer,)
from api.fields import DynamicFieldsMixin


class GeometryStoreRelatedSerializer(GeoFeatureModelSerializer):
    geostores = serializers.HyperlinkedIdentityField(
        many=True,
        read_only=True,
        lookup_field='identifier',
        view_name='api:geometrystore-detail'
    )

    class Meta:
        fields = ('geostores', 'attributes', 'label')

    def get_properties(self, instance, fields):
        props = instance.attributes.copy()
        return props


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


class GeometryStoreDetailSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    lines = LineStringGeometrySerializer(many=True, read_only=True)
    points = PointGeometrySerializer(many=True, read_only=True)
    polygons = PolygonGeometrySerializer(many=True, read_only=True)
    extent = serializers.SerializerMethodField()
    projects = ProjectNestableSerializer(many=True, read_only=True)

    def get_extent(self, obj):
        return obj.calculate_overall_extent()

    class Meta:
        model = GeometryStore
        fields = (
            'identifier',
            'attributes',
            'centroid',
            'lines',
            'points',
            'polygons',
            'extent',
            'projects',
        )
        indelible_fields = ('identifier',)


class GeometryStoreCentroidSerializer(GeoFeatureModelSerializer):

    class Meta:
        model = GeometryStore
        geo_field = 'centroid'
        id_field = 'identifier'

    def get_properties(self, instance, fields):
        return {
            'label': instance.label,
            'geostore': instance.identifier,
        }


class RegionBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = (
            'name',
            'id'
        )


class CountryBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = (
            'name',
            'alpha_3'
        )
