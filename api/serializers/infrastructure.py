from rest_framework import serializers
from infrastructure.models import Project, Initiative
from facts.serializers import OrganizationBasicSerializer
from api.fields import DynamicFieldsMixin


class ProjectBasicSerializer(serializers.ModelSerializer):
    url = serializers.CharField(source='get_absolute_url', read_only=True)

    class Meta:
        model = Project
        fields = (
            'name',
            'url',
        )


class ProjectSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    infrastructure_type = serializers.StringRelatedField()
    initiative = serializers.StringRelatedField()
    operator = OrganizationBasicSerializer(read_only=True)
    contractors = OrganizationBasicSerializer(many=True, read_only=True)
    consultants = OrganizationBasicSerializer(many=True, read_only=True)
    implementers = OrganizationBasicSerializer(many=True, read_only=True)
    url = serializers.CharField(source='get_absolute_url', read_only=True)

    class Meta:
        model = Project
        fields = (
            'name',
            'initiative', 'infrastructure_type',
            'planned_completion_year',
            'planned_completion_month',
            'planned_completion_day',
            'start_year',
            'start_month',
            'start_day',
            'url',
            'operator', 'contractors', 'consultants', 'implementers',
        )


class InitiativeSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    geographic_scope = serializers.StringRelatedField()

    class Meta:
        model = Initiative
        fields = (
            'name', 'initiative_type', 'founding_date',
            'geographic_scope'
        )
