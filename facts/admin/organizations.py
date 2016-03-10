from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from facts.models import (
    # Relations
    CompanyRelation, FinancingRelation, GovernmentRelation,
    MilitaryRelation, MultilateralRelation, NGORelation, PoliticalRelation,
    # shareholders
    FinancingOrganization,
)
from facts.fields import PercentageField


class ShareholderAdmin(admin.ModelAdmin):
    value = PercentageField()


class OrganizationShareholderInline(admin.TabularInline):
    model = FinancingOrganization.shareholder_organizations.through
    fk_name = 'right'


class PersonShareholderInline(admin.TabularInline):
    model = FinancingOrganization.shareholder_people.through


class CompanyInline(admin.TabularInline):
    model = CompanyRelation
    fk_name = 'right'


class FinancingInline(admin.TabularInline):
    model = FinancingRelation
    fk_name = 'right'


class GovernmentInline(admin.TabularInline):
    model = GovernmentRelation
    fk_name = 'right'


class MilitaryInline(admin.TabularInline):
    model = MilitaryRelation
    fk_name = 'right'


class MultilateralInline(admin.TabularInline):
    model = MultilateralRelation
    fk_name = 'right'


class NGOInline(admin.TabularInline):
    model = NGORelation
    fk_name = 'right'


class PoliticalInline(admin.TabularInline):
    model = PoliticalRelation
    fk_name = 'right'


class OrganizationAdmin(MPTTModelAdmin):
    save_on_top = True
    select_related = True
    search_fields = ['name']
    list_display = ('name', 'founding_date', 'dissolution_date', 'staff_size')
    inlines = [
        CompanyInline, FinancingInline, GovernmentInline,
        MilitaryInline, MultilateralInline, NGOInline, PoliticalInline
    ]


class FinancingOrganizationAdmin(OrganizationAdmin):
    shareholder_inlines = [OrganizationShareholderInline, PersonShareholderInline]
    inlines = shareholder_inlines + OrganizationAdmin.inlines
