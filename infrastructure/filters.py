import django_filters
from .models import Project, Initiative


class ProjectFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(name='name', lookup_expr='iexact')
    name__contains = django_filters.CharFilter(name='name', lookup_expr='icontains')

    initiative = django_filters.CharFilter(name='initiative__name', lookup_expr='iexact')
    initiative__contains = django_filters.CharFilter(name='initiative__name', lookup_expr='icontains')

    infrastructure_type = django_filters.CharFilter(name='infrastructure_type__name', lookup_expr='iexact')
    infrastructure_type__contains = django_filters.CharFilter(name='infrastructure_type__name', lookup_expr='icontains')

    funder_name = django_filters.CharFilter(name='funding__name', lookup_expr='iexact')
    funder_name__contains = django_filters.CharFilter(name='funding__name', lookup_expr='icontains')

    contractor = django_filters.CharFilter(
        name='contractors__name', lookup_expr='iexact', distinct=True
    )
    contractor__contains = django_filters.CharFilter(
        name='contractors__name', lookup_expr='icontains', distinct=True
    )

    consultant = django_filters.CharFilter(
        name='consultants__name', lookup_expr='iexact'
    )
    consultant__contains = django_filters.CharFilter(
        name='consultants__name', lookup_expr='icontains'
    )

    implementer = django_filters.CharFilter(
        name='implementers__name', lookup_expr='iexact'
    )
    implementer__contains = django_filters.CharFilter(
        name='implementers__name', lookup_expr='icontains'
    )

    operator = django_filters.CharFilter(
        name='operator__name', lookup_expr='iexact'
    )
    operator__contains = django_filters.CharFilter(
        name='operator__name', lookup_expr='iexact'
    )

    class Meta:
        model = Project
        fields = {
            'planned_completion_date': ['isnull', 'exact', 'gt', 'lt', 'year__lt', 'year__gt'],
            'start_date': ['isnull', 'exact', 'gt', 'lt', 'year__lt', 'year__gt']
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
