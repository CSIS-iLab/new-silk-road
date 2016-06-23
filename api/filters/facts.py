import rest_framework_filters as filters

from facts.models import (
    Organization,
    Person,
)
from api.filters.infrastructure import InitiativeFilter
from api.filters.locations import CountryFilter


class PersonFilter(filters.FilterSet):

    class Meta:
        model = Person
        fields = ['given_name', 'family_name']


class OrganizationFilter(filters.FilterSet):
    name = filters.AllLookupsFilter(name='name')
    leaders = filters.RelatedFilter(PersonFilter, name='leaders', distinct=True)
    parent = filters.RelatedFilter('api.filters.facts.OrganizationFilter', name='parent')
    countries = filters.RelatedFilter(CountryFilter, name='countries', distinct=True)
    principal_initiatives = filters.RelatedFilter(InitiativeFilter, name='principal_initiatives')

    class Meta:
        model = Organization
        fields = ['name', 'countries', 'leaders', 'initiatives']
