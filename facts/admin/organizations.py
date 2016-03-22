from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from facts.models import (
    Company,
    # Relations
    CompanyRelation, FinancingRelation, GovernmentRelation,
    MilitaryRelation, MultilateralRelation, NGORelation, PoliticalRelation,
    # shareholders
    FinancingOrganization,
)
from facts.fields import PercentageField
from publish.admin import TEMPORAL_FIELDS


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


class BaseOrganizationAdmin(MPTTModelAdmin):
    save_on_top = True
    select_related = True
    search_fields = ['name']
    list_display = ('name', 'founding_date', 'dissolution_date', 'staff_size') + TEMPORAL_FIELDS
    inlines = [
        CompanyInline, FinancingInline, GovernmentInline,
        MilitaryInline, MultilateralInline, NGOInline, PoliticalInline
    ]


class OrganizationAdmin(BaseOrganizationAdmin):

    actions = ['transform_to_company']

    # TODO Monkeypatch for all subclasses of Organization.
    def transform_to_company(selfself, request, queryset):
        for obj in queryset.all():
            child_obj = Company(organization_ptr=obj)
            for field in obj._meta.fields:
                setattr(child_obj, field.attname, getattr(obj, field.attname))
            child_obj.save()
    transform_to_company.short_description = "Transform to company"
    # TODO: Method to revert to base Organization from subclass?


class FinancingOrganizationAdmin(BaseOrganizationAdmin):
    shareholder_inlines = [OrganizationShareholderInline, PersonShareholderInline]
    inlines = shareholder_inlines + BaseOrganizationAdmin.inlines
