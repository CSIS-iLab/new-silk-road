from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from locations.models import (
    LineStringGeometry,
    PointGeometry,
    PolygonGeometry,
    GeometryStore,
)
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


class GeometryStoreSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    lines = LineStringGeometrySerializer(many=True, read_only=True)
    points = PointGeometrySerializer(many=True, read_only=True)
    polygons = PolygonGeometrySerializer(many=True, read_only=True)

    class Meta:
        model = GeometryStore
        fields = ('identifier', 'attributes', 'centroid', 'lines', 'points', 'polygons')
        indelible_fields = ('identifier',)


class GeometryStoreCentroidSerializer(GeoFeatureModelSerializer):

    class Meta:
        model = GeometryStore
        geo_field = 'centroid'

    def get_properties(self, instance, fields):
                # fields = ('identifier', 'attributes', 'centroid', 'projects')
        first_proj = instance.project_set.first()
        props = instance.attributes.copy()
        props.update({
            'geostore': instance.identifier,
        })
        if first_proj:
            props['project_name'] = first_proj.name
            props['project_slug'] = first_proj.slug
            try:
                props['project_url'] = first_proj.get_absolute_url()
            except Exception:
                pass
        return props
