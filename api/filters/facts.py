import rest_framework_filters as filters

from facts.models import (
    Organization,
    Person,
)
from locations.models import (
    Country,
)
from infrastructure.models import Initiative
from api.filters.infrastructure import InitiativeFilter
from api.filters.locations import CountryFilter


class PersonFilter(filters.FilterSet):

    class Meta:
        model = Person
        fields = ['given_name', 'family_name']


class OrganizationFilter(filters.FilterSet):
    name = filters.AllLookupsFilter(field_name='name')
    slug = filters.AllLookupsFilter(field_name='slug')
    leaders = filters.RelatedFilter(
        PersonFilter,
        queryset=Person.objects.all(),
        field_name='leaders',
        distinct=True
    )
    parent = filters.RelatedFilter(
        'api.filters.facts.OrganizationFilter',
        queryset=Organization.objects.all(),
        field_name='parent'
    )
    country = filters.RelatedFilter(
        CountryFilter,
        queryset=Country.objects.all(),
        field_name='countries',
        distinct=True
    )
    countries = filters.ModelMultipleChoiceFilter(
        queryset=Country.objects.all(),
        field_name='countries'
    )
    principal_initiatives = filters.RelatedFilter(
        InitiativeFilter,
        queryset=Initiative.objects.all(),
        field_name='principal_initiatives'
    )

    class Meta:
        model = Organization
        fields = ['name', 'countries', 'leaders', 'initiatives']
