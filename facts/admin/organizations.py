from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from facts.models import (
    # Relations
    CompanyRelation, FinancingRelation, GovernmentRelation,
    MilitaryRelation, MultilateralRelation, NGORelation, PoliticalRelation
)


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
    search_fields = ['name']
    inlines = [
        CompanyInline, FinancingInline, GovernmentInline,
        MilitaryInline, MultilateralInline, NGOInline, PoliticalInline
    ]
