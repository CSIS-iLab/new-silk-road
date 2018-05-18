from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from facts.models import (
    CompanySector,
    # shareholders
    FinancingOrganizationDetails,
)
from facts.fields import PercentageField
from publish.admin import (
    TEMPORAL_FIELDS,
    make_published,
    make_not_published
)
from utilities.admin import PhraseSearchAdminMixin
from facts.forms import (
    OrganizationShareholderForm,
    PersonShareholderForm,
    CompanyDetailsForm,
    FinancingOrganizationDetailsForm,
    GovernmentDetailsForm,
    MilitaryDetailsForm,
    MultilateralDetailsForm,
    NGODetailsForm,
    PoliticalDetailsForm,
)
from facts.forms import OrganizationForm


class CompanySectorListFilter(admin.SimpleListFilter):
    title = 'sector'
    parameter_name = 'sector'

    def lookups(self, request, model_admin):
        return CompanySector.CHOICES

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(sectors__contains=[int(self.value())])


class ShareholderAdmin(admin.ModelAdmin):
    value = PercentageField()


class OrganizationShareholderInline(admin.TabularInline):
    model = FinancingOrganizationDetails.shareholder_organizations.through
    form = OrganizationShareholderForm

    class Media:
        css = {
            "all": ("admin/css/adminfixes.css",)
        }


class PersonShareholderInline(admin.TabularInline):
    model = FinancingOrganizationDetails.shareholder_people.through
    form = PersonShareholderForm

    class Media:
        css = {
            "all": ("admin/css/adminfixes.css",)
        }


class OrganizationAdmin(PhraseSearchAdminMixin, MPTTModelAdmin):
    form = OrganizationForm
    filter_horizontal = [
        'leaders',
        'initiatives',
        'related_organizations',
        'related_events',
        'documents',
    ]
    save_on_top = True
    select_related = True
    search_fields = (
        'name',
        'parent__name',
    )
    list_display = (
        'name',
        'founding_year',
        'dissolution_year',
        'staff_size'
    ) + TEMPORAL_FIELDS + ('published', )
    actions = [make_published, make_not_published]
    ordering = ['name', 'created_at', 'published']
    list_filter = (
        'published',
    )
    prepopulated_fields = {"slug": ("name",)}


class OrganizationType(MPTTModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


class OrganizationDetailsAdmin(admin.ModelAdmin):
    list_display = ['__str__']
    search_fields = (
        'organization__name',
    )

    class Media:
        css = {
            "all": ("admin/css/adminfixes.css",)
        }


class CompanyDetailsAdmin(OrganizationDetailsAdmin):
    form = CompanyDetailsForm
    list_display = OrganizationDetailsAdmin.list_display + ['get_sectors_display', 'structure', 'org_type']
    list_filter = ('org_type', CompanySectorListFilter)
    search_fields = OrganizationDetailsAdmin.search_fields + (
        'structure__name',
    )

    def get_sectors_display(self, obj):
        return obj.get_sector_list_display()
    get_sectors_display.short_description = 'Sectors'


class FinancingOrganizationDetailsAdmin(OrganizationDetailsAdmin):
    form = FinancingOrganizationDetailsForm
    inlines = [OrganizationShareholderInline, PersonShareholderInline]
    list_display = OrganizationDetailsAdmin.list_display + ['approved_capital', 'moodys_credit_rating']
    filter_horizontal = [
        'members',
        'scope_of_operations',
    ]


class GovernmentDetailsDetailsAdmin(OrganizationDetailsAdmin):
    form = GovernmentDetailsForm
    list_display = OrganizationDetailsAdmin.list_display + ['country']
    search_fields = OrganizationDetailsAdmin.search_fields + (
        'country__name',
    )


class MilitaryDetailsAdmin(OrganizationDetailsAdmin):
    form = MilitaryDetailsForm


class MultilateralDetailsAdmin(OrganizationDetailsAdmin):
    form = MultilateralDetailsForm
    filter_horizontal = [
        'members',
    ]


class NGODetailsAdmin(OrganizationDetailsAdmin):
    form = NGODetailsForm
    filter_horizontal = [
        'geographic_scope',
        'members',
    ]


class PoliticalDetailsAdmin(OrganizationDetailsAdmin):
    form = PoliticalDetailsForm
    filter_horizontal = [
        'countries',
    ]


class CompanyStructureAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
