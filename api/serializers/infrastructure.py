from rest_framework import serializers
from infrastructure.models import Project, ProjectFunding, Initiative, InfrastructureType
from api.serializers.facts import OrganizationBasicSerializer
from api.serializers.locations import GeometryStoreCentroidSerializer
from api.fields import DynamicFieldsMixin


class InitiativeBasicSerializer(serializers.ModelSerializer):
    page_url = serializers.CharField(source='get_absolute_url', read_only=True)
    url = serializers.HyperlinkedIdentityField(
        view_name='api:initiative-detail',
        lookup_field='identifier'
    )

    class Meta:
        model = Initiative
        fields = (
            'name',
            'page_url',
            'url'
        )


class ProjectBasicSerializer(serializers.ModelSerializer):
    page_url = serializers.CharField(source='get_absolute_url', read_only=True)
    url = serializers.HyperlinkedIdentityField(
        view_name='api:project-detail',
        lookup_field='identifier'
    )

    class Meta:
        model = Project
        fields = (
            'name',
            'page_url',
            'url'
        )


class ProjectFundingSerializer(serializers.ModelSerializer):
    sources = OrganizationBasicSerializer(many=True, read_only=True)

    class Meta:
        model = ProjectFunding
        fields = (
            'sources',
            'amount',
            'currency',
        )


class ProjectSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    identifier = serializers.UUIDField()
    geo = GeometryStoreCentroidSerializer(read_only=True)
    infrastructure_type = serializers.StringRelatedField()
    initiatives = InitiativeBasicSerializer(many=True, read_only=True)
    funding = ProjectFundingSerializer(many=True, read_only=True)
    # operators = OrganizationBasicSerializer(many=True, read_only=True)
    # contractors = OrganizationBasicSerializer(many=True, read_only=True)
    # consultants = OrganizationBasicSerializer(many=True, read_only=True)
    # implementers = OrganizationBasicSerializer(many=True, read_only=True)
    page_url = serializers.CharField(source='get_absolute_url', read_only=True)
    url = serializers.HyperlinkedIdentityField(
        view_name='api:project-detail',
        lookup_field='identifier'
    )

    class Meta:
        model = Project
        fields = (
            'name',
            'identifier',
            'initiatives', 'infrastructure_type',
            'planned_completion_year',
            'planned_completion_month',
            'planned_completion_day',
            'commencement_year',
            'commencement_month',
            'commencement_day',
            'start_year',
            'start_month',
            'start_day',
            'total_cost',
            'total_cost_currency',
            'funding',
            'page_url',
            'url',
            'geo',
            # 'operators', 'contractors', 'consultants', 'implementers',
        )


class InitiativeSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    geographic_scope = serializers.StringRelatedField()
    project_set = ProjectBasicSerializer(many=True, read_only=True)

    class Meta:
        model = Initiative
        fields = (
            'name', 'initiative_type', 'founding_date',
            'geographic_scope', 'project_set'
        )


class InfrastructureTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = InfrastructureType
        fields = (
            'id',
            'name',
        )
