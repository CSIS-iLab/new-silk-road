import django_filters
from django.db.models import Count, Q
from .models import Project, Initiative
from finance.currency import CURRENCY_CHOICES


class ProjectFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(name='name', lookup_expr='iexact')
    name__contains = django_filters.CharFilter(name='name', lookup_expr='icontains')

    initiative_name = django_filters.CharFilter(name='initiatives__name', lookup_expr='iexact')
    initiative_name__contains = django_filters.CharFilter(name='initiatives__name', lookup_expr='icontains')
    initiatives__isnull = django_filters.BooleanFilter(name='initiatives', lookup_expr='isnull')
    initiatives__count = django_filters.MethodFilter()
    initiatives__count__gt = django_filters.MethodFilter()
    initiatives__count__gte = django_filters.MethodFilter()
    initiatives__count__lt = django_filters.MethodFilter()
    initiatives__count__lte = django_filters.MethodFilter()

    infrastructure_type = django_filters.CharFilter(
        name='infrastructure_type__name', lookup_expr='iexact', distinct=True
    )
    infrastructure_type__contains = django_filters.CharFilter(
        name='infrastructure_type__name', lookup_expr='icontains', distinct=True
    )

    funder_name = django_filters.CharFilter(
        name='funding__name', lookup_expr='iexact', distinct=True
    )
    funder_name__contains = django_filters.CharFilter(
        name='funding__name', lookup_expr='icontains', distinct=True
    )
    funder_country = django_filters.CharFilter(
        name='funding__sources__countries__name', lookup_expr='iexact', distinct=True
    )
    funder_country_codes = django_filters.MethodFilter()

    contractor = django_filters.CharFilter(
        name='contractors__name', lookup_expr='iexact', distinct=True
    )
    contractor__contains = django_filters.CharFilter(
        name='contractors__name', lookup_expr='icontains', distinct=True
    )

    consultant = django_filters.CharFilter(
        name='consultants__name', lookup_expr='iexact', distinct=True
    )
    consultant__contains = django_filters.CharFilter(
        name='consultants__name', lookup_expr='icontains', distinct=True
    )

    implementer = django_filters.CharFilter(
        name='implementers__name', lookup_expr='iexact', distinct=True
    )
    implementer__contains = django_filters.CharFilter(
        name='implementers__name', lookup_expr='icontains', distinct=True
    )

    operator = django_filters.CharFilter(
        name='operators__name', lookup_expr='iexact', distinct=True
    )
    operator__contains = django_filters.CharFilter(
        name='operators__name', lookup_expr='iexact', distinct=True
    )

    fieldbook_id = django_filters.CharFilter(
        name='extra_data__dictionary__project_id', lookup_expr='exact', distinct=True
    )

    total_cost_currency = django_filters.ChoiceFilter(
        choices=CURRENCY_CHOICES
    )

    def _filter_initiatives_count(self, queryset, value, filter_expression):
        if value:
            lookup = {filter_expression: value}
            return queryset.annotate(num_initiatives=Count('initiatives')).filter(**lookup)
        return queryset

    def filter_initiatives__count(self, queryset, value):
        return self._filter_initiatives_count(queryset, value, 'num_initiatives')

    def filter_initiatives__count__gt(self, queryset, value):
        return self._filter_initiatives_count(queryset, value, 'num_initiatives__gt')

    def filter_initiatives__count__gte(self, queryset, value):
        return self._filter_initiatives_count(queryset, value, 'num_initiatives__gte')

    def filter_initiatives__count__lt(self, queryset, value):
        return self._filter_initiatives_count(queryset, value, 'num_initiatives__lt')

    def filter_initiatives__count__lte(self, queryset, value):
        return self._filter_initiatives_count(queryset, value, 'num_initiatives__lte')

    def filter_funder_country_codes(self, queryset, value):
        lookup_expr = 'funding__sources__countries__alpha_3__iexact'
        if value:
            if ',' in value:
                value_list = value.split(',')
                for v in value_list:
                    queryset = queryset.filter(**{lookup_expr: v})
                return queryset.distinct('name')
            elif '|' in value:
                value_list = value.split('|')
                q_args = Q(**{lookup_expr: value_list[0]})
                for v in value_list[1:]:
                    q_args |= Q(**{lookup_expr: v})
                return queryset.filter(q_args).distinct('name')
            else:
                return queryset.filter(**{lookup_expr: value.strip()}).distinct('name')
        return queryset

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


class InitiativeFilter(django_filters.FilterSet):
    geographic_scope = django_filters.CharFilter(name='geographic_scope__name', lookup_expr='iexact')
    geographic_scope__contains = django_filters.CharFilter(name='geographic_scope__name', lookup_expr='icontains')

    class Meta:
        model = Initiative
        fields = {
            'name': ['exact', 'contains'],
            'founding_date': ['isnull', 'exact', 'gt', 'lt', 'year__lt', 'year__gt'],
            'geographic_scope': ['isnull']
        }
