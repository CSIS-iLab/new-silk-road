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
    name = filters.AllLookupsFilter(name='name')
    slug = filters.AllLookupsFilter(name='slug')
    leaders = filters.RelatedFilter(
        PersonFilter,
        queryset=Person.objects.all(),
        name='leaders',
        distinct=True
    )
    parent = filters.RelatedFilter(
        'api.filters.facts.OrganizationFilter',
        queryset=Organization.objects.all(),
        name='parent'
    )
    country = filters.RelatedFilter(
        CountryFilter,
        queryset=Country.objects.all(),
        name='countries',
        distinct=True
    )
    countries = filters.ModelMultipleChoiceFilter(
        queryset=Country.objects.all(),
        name='countries'
    )
    principal_initiatives = filters.RelatedFilter(
        InitiativeFilter,
        queryset=Initiative.objects.all(),
        name='principal_initiatives'
    )

    class Meta:
        model = Organization
        fields = ['name', 'countries', 'leaders', 'initiatives']
