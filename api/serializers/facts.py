from rest_framework import serializers
from facts.models import (
    Organization, Person
)


class OrganizationBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Organization
        fields = (
            'name', 'get_absolute_url'
        )


class PersonBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Person
        fields = (
            'given_name', 'family_name', 'identifier', 'get_absolute_url'
        )
