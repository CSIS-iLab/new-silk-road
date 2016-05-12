from rest_framework import serializers
from facts.models import (
    Organization, Person
)


class OrganizationBasicSerializer(serializers.ModelSerializer):
    page_url = serializers.CharField(source='get_absolute_url', read_only=True)

    class Meta:
        model = Organization
        fields = (
            'name', 'page_url',
        )


class PersonBasicSerializer(serializers.ModelSerializer):
    page_url = serializers.CharField(source='get_absolute_url', read_only=True)

    class Meta:
        model = Person
        fields = (
            'given_name', 'family_name', 'identifier', 'page_url'
        )
