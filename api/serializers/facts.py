from rest_framework import serializers
from facts.models import (
    Organization, Person
)


class OrganizationBasicSerializer(serializers.ModelSerializer):
    url = serializers.CharField(source='get_absolute_url', read_only=True)

    class Meta:
        model = Organization
        fields = (
            'name', 'url'
        )


class PersonBasicSerializer(serializers.ModelSerializer):
    url = serializers.CharField(source='get_absolute_url', read_only=True)

    class Meta:
        model = Person
        fields = (
            'given_name', 'family_name', 'identifier', 'url'
        )
