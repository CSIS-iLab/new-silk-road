from django.contrib import admin
from django.forms.models import ModelForm
from facts.models.organizations import Organization
from facts.models import (
    # Organizations
    Company, FinancingOrganization, Government,
    Military, Multilateral, NGO, Political,
)


class FilteredOrganizationForm(ModelForm):
    filter_class = None

    def __init__(self, *args, **kwargs):
        super(FilteredOrganizationForm, self).__init__(*args, **kwargs)
        if self.filter_class:
            import ipdb; ipdb.set_trace()
            # TODO: Fix this mess
            class_qs = self.filter_class.objects.all()
            qs = self.fields['from_organization'].queryset
            qs = qs.filter(related_organizations__in=class_qs)
            self.fields['from_organization'].queryset = qs


class CompanyFilteredForm(FilteredOrganizationForm):
    filter_class = Company


# Relation inlines
class OrganizationInline(admin.TabularInline):
    model = Organization.related_organizations.through
    fk_name = 'to_organization'
    filter_class = None

    @property
    def verbose_name(self):
        return self.filter_class._meta.verbose_name

    @property
    def verbose_name_plural(self):
        return self.filter_class._meta.verbose_name_plural


class CompanyInline(OrganizationInline):
    filter_class = Company
    form = CompanyFilteredForm


class FinancingInline(OrganizationInline):
    filter_class = FinancingOrganization


class GovernmentInline(OrganizationInline):
    filter_class = Government


class MilitaryInline(OrganizationInline):
    filter_class = Military


class MultilateralInline(OrganizationInline):
    filter_class = Multilateral


class NGOInline(OrganizationInline):
    filter_class = NGO


class PoliticalInline(OrganizationInline):
    filter_class = Political


ALL_RELATION_INLINES = (
    CompanyInline, FinancingInline, GovernmentInline,
    MilitaryInline, MultilateralInline, NGOInline,
    PoliticalInline
)


# Organization admins
class CompanyAdmin(admin.ModelAdmin):
    inlines = list(ALL_RELATION_INLINES)
