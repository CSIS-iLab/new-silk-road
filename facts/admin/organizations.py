from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from facts.models import (
    # shareholders
    FinancingOrganizationDetails,
)
from facts.fields import PercentageField
from publish.admin import TEMPORAL_FIELDS


class ShareholderAdmin(admin.ModelAdmin):
    value = PercentageField()


class OrganizationShareholderInline(admin.TabularInline):
    model = FinancingOrganizationDetails.shareholder_organizations.through


class PersonShareholderInline(admin.TabularInline):
    model = FinancingOrganizationDetails.shareholder_people.through


class OrganizationAdmin(MPTTModelAdmin):
    save_on_top = True
    select_related = True
    search_fields = ['name']
    list_display = ('name', 'founding_date', 'dissolution_date', 'staff_size') + TEMPORAL_FIELDS


class OrganizationDetailsAdmin(admin.ModelAdmin):
    list_display = ['__str__']


class FinancingOrganizationDetailsAdmin(OrganizationDetailsAdmin):
    inlines = [OrganizationShareholderInline, PersonShareholderInline]
    list_display = OrganizationDetailsAdmin.list_display + ['approved_capital', 'moodys_credit_rating']


class CompanyDetailsAdmin(OrganizationDetailsAdmin):
    list_display = OrganizationDetailsAdmin.list_display + ['sector']


class GovernmentDetailsDetailsAdmin(OrganizationDetailsAdmin):
    list_display = OrganizationDetailsAdmin.list_display + ['country']
