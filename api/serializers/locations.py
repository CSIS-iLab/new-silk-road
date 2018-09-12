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
from infrastructure.models import Project
from api.serializers.infrastructure import (ProjectNestableSerializer,)
from api.fields import DynamicFieldsMixin

ICON_MAP = {
    "seaport": "Seaport",
    "dryport": "Dryport",
    "rail": "Rail",
    "road": "Road",
    "multimodal": "Dryport",
    "intermodal": "Dryport",
    "powerplant": "Powerplant",
}


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
        fields = ('lines', 'points', 'polygons', 'label', 'attributes', 'identifier',
                  'centroid', 'id')

    def get_properties(self, instance, fields):
        """
        Return the properties for the API endpoint.

        This makes use of the project_name, project_type, project_alt_name, and
        other annotations provided by the view for performance
        """
        proj_name = getattr(instance, 'project_alt_name') or instance.project_name or None
        infra_name = instance.project_type or None
        icon_type = ICON_MAP.get(infra_name.lower(), 'dot') if infra_name else None
        total_cost = '{} {} {}'.format(
            round(instance.total_cost_dividend, 1),
            instance.total_cost_unit,
            instance.currency
        ) if instance.total_cost_dividend else "Unknown"
        return {
            'label': proj_name,
            'geostore': instance.identifier,
            'infrastructureType': infra_name,
            'icon-image': icon_type,
            'locations': instance.locations,
            'total_cost': total_cost,
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
            'id',
            'name',
            'alpha_3'
        )
