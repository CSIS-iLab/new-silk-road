import rest_framework_filters as filters
from django.db.models import Count, Q
from infrastructure.models import (
    Project,
    ProjectFunding,
    Initiative,
    InfrastructureType
)
from finance.currency import CURRENCY_CHOICES
from api.filters.facts import OrganizationFilter
from api.filters.locations import CountryFilter, RegionFilter


class InfrastructureTypeFilter(filters.FilterSet):
    class Meta:
        model = InfrastructureType
        fields = ['name']


class InitiativeFilter(filters.FilterSet):
    name = filters.AllLookupsFilter(name='name')

    geographic_scope = filters.RelatedFilter(RegionFilter, name='geographic_scope')

    class Meta:
        model = Initiative
        fields = {
            'founding_date': filters.ALL_LOOKUPS
        }


class ProjectFundingFilter(filters.FilterSet):
    sources = filters.RelatedFilter(OrganizationFilter, name='sources', distinct=True)
    project = filters.RelatedFilter('api.filters.infrastructure.ProjectFilter', name='project')
    amount = filters.AllLookupsFilter(name='amount')
    currency = filters.ChoiceFilter(name='currency', choices=CURRENCY_CHOICES)

    class Meta:
        model = ProjectFunding


class ProjectFilter(filters.FilterSet):
    name = filters.AllLookupsFilter(name='name')
    countries = filters.RelatedFilter(CountryFilter, name='countries')

    initiatives = filters.RelatedFilter(InitiativeFilter, name='initiatives')
    initiatives__count = filters.MethodFilter()
    initiatives__count__gt = filters.MethodFilter()
    initiatives__count__gte = filters.MethodFilter()
    initiatives__count__lt = filters.MethodFilter()
    initiatives__count__lte = filters.MethodFilter()

    infrastructure_type = filters.RelatedFilter(InfrastructureTypeFilter, name='infrastructure_type')

    funding = filters.RelatedFilter(ProjectFundingFilter, name='funding', distinct=True)
    # TODO: MethodFilter for amount + currency

    contractors = filters.RelatedFilter(OrganizationFilter, name='contractors')
    consultants = filters.RelatedFilter(OrganizationFilter, name='consultants')
    implementers = filters.RelatedFilter(OrganizationFilter, name='implementers')
    operators = filters.RelatedFilter(OrganizationFilter, name='operators')

    fieldbook_id = filters.CharFilter(
        name='extra_data__dictionary__project_id', lookup_expr='exact', distinct=True
    )

    total_cost_currency = filters.ChoiceFilter(
        choices=CURRENCY_CHOICES
    )

    def _filter_initiatives_count(self, queryset, value, filter_expression):
        if value:
            lookup = {filter_expression: value}
            return queryset.annotate(num_initiatives=Count('initiatives')).filter(**lookup)
        return queryset

    def filter_initiatives__count(self, name, queryset, value):
        return self._filter_initiatives_count(queryset, value, 'num_initiatives')

    def filter_initiatives__count__gt(self, name, queryset, value):
        return self._filter_initiatives_count(queryset, value, 'num_initiatives__gt')

    def filter_initiatives__count__gte(self, name, queryset, value):
        return self._filter_initiatives_count(queryset, value, 'num_initiatives__gte')

    def filter_initiatives__count__lt(self, name, queryset, value):
        return self._filter_initiatives_count(queryset, value, 'num_initiatives__lt')

    def filter_initiatives__count__lte(self, name, queryset, value):
        return self._filter_initiatives_count(queryset, value, 'num_initiatives__lte')

    class Meta:
        model = Project
        fields = {
            'total_cost': ['isnull', 'exact', 'gt', 'lt', 'gte', 'lte'],
            'planned_completion_year': ['isnull', 'exact', 'gt', 'lt', 'gte', 'lte'],
            'planned_completion_month': ['isnull', 'exact', 'gt', 'lt', 'gte', 'lte'],
            'planned_completion_day': ['isnull', 'exact', 'gt', 'lt', 'gte', 'lte'],
            'start_year': ['isnull', 'exact', 'gt', 'lt', 'gte', 'lte'],
            'start_month': ['isnull', 'exact', 'gt', 'lt', 'gte', 'lte'],
            'start_day': ['isnull', 'exact', 'gt', 'lt', 'gte', 'lte'],
            'commencement_year': ['isnull', 'exact', 'gt', 'lt', 'gte', 'lte'],
            'commencement_month': ['isnull', 'exact', 'gt', 'lt', 'gte', 'lte'],
            'commencement_day': ['isnull', 'exact', 'gt', 'lt', 'gte', 'lte'],
        }
