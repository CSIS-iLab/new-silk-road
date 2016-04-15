from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from facts.models import (
    # shareholders
    FinancingOrganizationDetails,
)
from facts.fields import PercentageField
from publish.admin import (
    TEMPORAL_FIELDS,
    make_published,
    make_not_published
)


class ShareholderAdmin(admin.ModelAdmin):
    value = PercentageField()


class OrganizationShareholderInline(admin.TabularInline):
    model = FinancingOrganizationDetails.shareholder_organizations.through


class PersonShareholderInline(admin.TabularInline):
    model = FinancingOrganizationDetails.shareholder_people.through


class OrganizationAdmin(MPTTModelAdmin):
    save_on_top = True
    select_related = True
    search_fields = (
        'name',
        'parent__name',
        'countries__name',
        'leaders__given_name',
        'leaders__family_name',
        'initiatives__name',
        'related_events__name',
        'related_organizations__name',
        'projects_consulted__name',
        'projects_contracted__name',
        'projects_funded__name',
        'projects_implemented__name',
        'projects_operated__name',
    )
    list_display = ('name', 'founding_date', 'dissolution_date', 'staff_size') + TEMPORAL_FIELDS + ('published',)
    actions = [make_published, make_not_published]
    prepopulated_fields = {"slug": ("name",)}


class OrganizationType(MPTTModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


class OrganizationDetailsAdmin(admin.ModelAdmin):
    list_display = ['__str__']


class FinancingOrganizationDetailsAdmin(OrganizationDetailsAdmin):
    inlines = [OrganizationShareholderInline, PersonShareholderInline]
    list_display = OrganizationDetailsAdmin.list_display + ['approved_capital', 'moodys_credit_rating']


class CompanyDetailsAdmin(OrganizationDetailsAdmin):
    list_display = OrganizationDetailsAdmin.list_display + ['sector', 'structure', 'org_type']
    list_filter = ('sector', 'org_type')


class CompanyStructureAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


class GovernmentDetailsDetailsAdmin(OrganizationDetailsAdmin):
    list_display = OrganizationDetailsAdmin.list_display + ['country']


class PoliticalDetailsAdmin(OrganizationDetailsAdmin):
    pass
