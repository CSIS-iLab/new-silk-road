import rest_framework_filters as filters
from django.db.models import Count
from infrastructure.models import (
    Project,
    ProjectStatus,
    ProjectFunding,
    Initiative,
    InfrastructureType
)
from locations.models import (
    Region,
    Country,
)
from finance.currency import CURRENCY_CHOICES


class InfrastructureTypeFilter(filters.FilterSet):
    class Meta:
        model = InfrastructureType
        fields = ['name']


class InitiativeFilter(filters.FilterSet):
    name = filters.AllLookupsFilter(name='name')

    geographic_scope = filters.RelatedFilter(
        'api.filters.locations.RegionFilter', name='geographic_scope'
    )

    principal_agent = filters.RelatedFilter(
        'api.filters.facts.OrganizationFilter', name='principal_agent'
    )

    class Meta:
        model = Initiative
        fields = {
            'founding_year': '__all__',
            'founding_month': '__all__',
            'founding_day': '__all__',
        }


class ProjectFundingFilter(filters.FilterSet):
    sources = filters.RelatedFilter(
        'api.filters.facts.OrganizationFilter', name='sources', distinct=True
    )
    project = filters.RelatedFilter(
        'api.filters.infrastructure.ProjectFilter', name='project'
    )
    amount = filters.AllLookupsFilter(name='amount')
    currency = filters.CharFilter(name='currency', lookup_expr='iexact')
    currency_amount = filters.CharFilter(method='filter_currency_amount')
    currency_amount__gt = filters.CharFilter(method='filter_currency_amount__gt')
    currency_amount__gte = filters.CharFilter(method='filter_currency_amount__gte')
    currency_amount__lt = filters.CharFilter(method='filter_currency_amount__lt')
    currency_amount__lte = filters.CharFilter(method='filter_currency_amount__lte')

    def __filter__currency_amount(self, queryset, name, value, modifier=None):
        currency_field = 'currency'
        amount_field = name.replace('currency_amount', 'amount')
        currency_field = name.replace('currency_amount', 'currency__iexact')
        if modifier:
            currency_field = currency_field.replace(modifier, '').rstrip('_')

        value = value.strip()
        value_list = value.split(' ')
        if len(value_list) == 2:
            lookup = {
                amount_field: value_list[0],
                currency_field: value_list[1]
            }
            return queryset.filter(**lookup)
        return queryset.none()

    def filter_currency_amount(self, queryset, name, value):
        return self.__filter__currency_amount(queryset, name, value)

    def filter_currency_amount__gt(self, queryset, name, value):
        return self.__filter__currency_amount(queryset, name, value, modifier='gt')

    def filter_currency_amount__gte(self, queryset, name, value):
        return self.__filter__currency_amount(queryset, name, value, modifier='gte')

    def filter_currency_amount__lt(self, queryset, name, value):
        return self.__filter__currency_amount(queryset, name, value, modifier='lt')

    def filter_currency_amount__lte(self, queryset, name, value):
        return self.__filter__currency_amount(queryset, name, value, modifier='lte')

    class Meta:
        model = ProjectFunding
        fields = {
            'currency_amount': ['gt', 'gte', 'lt', 'lte'],
            'amount': ['iexact', 'lte', 'contains', 'lt', 'iendswith', 'gte', 'gt',
                       'startswith', 'range', 'isnull', 'istartswith', 'endswith',
                       'iregex', 'in', 'regex', 'icontains', 'search', 'contained_by']
        }


class ProjectFilter(filters.FilterSet):
    name = filters.AllLookupsFilter(name='name')
    status = filters.MultipleChoiceFilter(choices=ProjectStatus.STATUSES)
    country = filters.RelatedFilter(
        'api.filters.locations.CountryFilter', name='countries'
    )
    countries = filters.ModelMultipleChoiceFilter(queryset=Country.objects.all(), name='countries')

    geo__identifier = filters.CharFilter(name='geo__identifier')

    region = filters.RelatedFilter(
        'api.filters.locations.RegionFilter', name='regions'
    )
    regions = filters.ModelMultipleChoiceFilter(queryset=Region.objects.all(), name='regions')

    initiatives = filters.RelatedFilter(InitiativeFilter, name='initiatives')
    initiatives__count = filters.CharFilter()
    initiatives__count__gt = filters.CharFilter(method='filter_initiatives__count__gt')
    initiatives__count__gte = filters.CharFilter(method='filter_initiatives__count__gte')
    initiatives__count__lt = filters.CharFilter(method='filter_initiatives__count__lt')
    initiatives__count__lte = filters.CharFilter(method='filter_initiatives__count__lte')

    infrastructure_type = filters.ModelMultipleChoiceFilter(queryset=InfrastructureType.objects.all())

    funding = filters.RelatedFilter(ProjectFundingFilter, name='funding', distinct=True)

    contractors = filters.RelatedFilter(
        'api.filters.facts.OrganizationFilter', name='contractors'
    )
    consultants = filters.RelatedFilter(
        'api.filters.facts.OrganizationFilter', name='consultants'
    )
    implementers = filters.RelatedFilter(
        'api.filters.facts.OrganizationFilter', name='implementers'
    )
    operators = filters.RelatedFilter(
        'api.filters.facts.OrganizationFilter', name='operators'
    )

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

    def filter_initiatives__count(self, queryset, name, value):
        return self._filter_initiatives_count(queryset, value, 'num_initiatives')

    def filter_initiatives__count__gt(self, queryset, name, value):
        return self._filter_initiatives_count(queryset, value, 'num_initiatives__gt')

    def filter_initiatives__count__gte(self, queryset, name, value):
        return self._filter_initiatives_count(queryset, value, 'num_initiatives__gte')

    def filter_initiatives__count__lt(self, queryset, name, value):
        return self._filter_initiatives_count(queryset, value, 'num_initiatives__lt')

    def filter_initiatives__count__lte(self, queryset, name, value):
        return self._filter_initiatives_count(queryset, value, 'num_initiatives__lte')

    total_cost_amount = filters.CharFilter()
    total_cost_amount__gt = filters.CharFilter(method='filter_total_cost_amount__gt')
    total_cost_amount__gte = filters.CharFilter(method='filter_total_cost_amount__gte')
    total_cost_amount__lt = filters.CharFilter(method='filter_total_cost_amount__lt')
    total_cost_amount__lte = filters.CharFilter(method='filter_total_cost_amount__lte')

    def __filter__total_cost_amount(self, queryset, name, value, modifier=None):
        currency_field = 'currency'
        amount_field = name.replace('total_cost_amount', 'total_cost')
        currency_field = name.replace('total_cost_amount', 'total_cost_currency__iexact')
        if modifier:
            currency_field = currency_field.replace(modifier, '').rstrip('_')

        value = value.strip()
        value_list = value.split(' ')
        if len(value_list) == 2:
            lookup = {
                amount_field: value_list[0],
                currency_field: value_list[1]
            }
            return queryset.filter(**lookup)
        return queryset.none()

    def filter_total_cost_amount(self, queryset, name, value):
        return self.__filter__total_cost_amount(queryset, name, value)

    def filter_total_cost_amount__gt(self, queryset, name, value):
        return self.__filter__total_cost_amount(queryset, name, value, modifier='gt')

    def filter_total_cost_amount__gte(self, queryset, name, value):
        return self.__filter__total_cost_amount(queryset, name, value, modifier='gte')

    def filter_total_cost_amount__lt(self, queryset, name, value):
        return self.__filter__total_cost_amount(queryset, name, value, modifier='lt')

    def filter_total_cost_amount__lte(self, queryset, name, value):
        return self.__filter__total_cost_amount(queryset, name, value, modifier='lte')

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
