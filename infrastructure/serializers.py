from rest_framework import serializers
from infrastructure.models import Project, Initiative


class ProjectSerializer(serializers.ModelSerializer):
    infrastructure_type = serializers.StringRelatedField()
    initiative = serializers.StringRelatedField()

    class Meta:
        model = Project
        fields = (
            'name',
            'initiative', 'infrastructure_type',
            'planned_completion_date', 'start_date',
            'get_absolute_url'
        )


class InitiativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Initiative
        fields = (
            'name', 'initiative_type', 'founding_date',
            'geographic_scope'
        )
