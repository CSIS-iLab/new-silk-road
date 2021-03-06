from django.contrib import admin
from django.db import models
from django.utils.html import format_html, format_html_join
from django.core.urlresolvers import reverse
from mptt.admin import MPTTModelAdmin
from infrastructure.models import (
    Project, ProjectDocument, InfrastructureType,
    ProjectFunding, PowerPlant, CuratedProjectCollection,
    Initiative, InitiativeType,
    Fuel, FuelCategory, PlantOwnerStake, ProjectOwnerStake,
    ProjectSubstation
)
from publish.admin import (
    make_published,
    make_not_published
)
from infrastructure.forms import (
    InitiativeForm,
    ProjectForm,
    ProjectDocumentForm,
    ProjectFundingForm,
    PowerPlantForm,
    PlantOwnerStakeForm,
    ProjectOwnerStakeForm,
    ProjectSubstationForm
)
from facts.forms import NameSearchWidget
from utilities.admin import PhraseSearchAdminMixin


class PersonInitiativeInline(admin.StackedInline):
    model = Initiative.affiliated_people.through


class ProjectFundingInline(admin.StackedInline):
    model = ProjectFunding
    form = ProjectFundingForm

    class Media:
        css = {
            "all": ("admin/css/adminfixes.css",)
        }


class ProjectsInitiativeInline(admin.StackedInline):
    model = Project.initiatives.through
    formfield_overrides = {
        # There is only one FK where this inline is used and it points to Project
        models.ForeignKey: {'widget': NameSearchWidget(
            model=Project, attrs={'style': 'width: 80%;'})},
    }

    class Media:
        css = {
            "all": ("admin/css/adminfixes.css",)
        }


class PlantOwnersInline(admin.StackedInline):
    model = PlantOwnerStake
    form = PlantOwnerStakeForm
    raw_id_fields = ('owner',)

    class Media:
        css = {
            "all": ("admin/css/adminfixes.css",)
        }


class ProjectOwnersInline(admin.StackedInline):
    model = ProjectOwnerStake
    form = ProjectOwnerStakeForm
    raw_id_fields = ('owner',)

    class Media:
        css = {
            "all": ("admin/css/adminfixes.css",)
        }


class ProjectSubstationsInline(admin.TabularInline):
    model = ProjectSubstation
    form = ProjectSubstationForm

    class Media:
        css = {
            "all": ("admin/css/adminfixes.css",)
    }


class ProjectsDocumentsInline(admin.StackedInline):
    model = Project.documents.through
    formfield_overrides = {
        # There is only one FK where this inline is used and it points to Project
        models.ForeignKey: {'widget': NameSearchWidget(
            model=Project, attrs={'style': 'width: 80%;'})},
    }

    class Media:
        css = {
            "all": ("admin/css/adminfixes.css",)
        }


class HasGeoListFilter(admin.SimpleListFilter):
    title = 'has geo'
    parameter_name = 'geo'

    def lookups(self, request, model_admin):
        """
        Returns a list of tuples. The first element in each
        tuple is the coded value for the option that will
        appear in the URL query. The second element is the
        human-readable name for the option that will appear
        in the right sidebar.
        """
        return (
            ('true', 'Yes'),
            ('false', 'No'),
        )

    def queryset(self, request, queryset):
        val = self.value()
        if val:
            has_geo = val == 'true'
            return queryset.filter(geo__isnull=(not has_geo))
        return queryset


@admin.register(Project)
class ProjectAdmin(PhraseSearchAdminMixin, admin.ModelAdmin):
    save_on_top = True
    form = ProjectForm
    prepopulated_fields = {
        "slug": ("name",),
        "alternate_slug": ("alternate_name",)
    }
    list_display = (
        'id',
        'fieldbook_id',
        'name',
        'infrastructure_type',
        # TODO: Provide some info on operators in list view? Maybe an Ajax popup???
        # - Countries
        # - Sources of Funding
        # - Implementers
        # - Initiatives
        'status',
        'start_year',
        'planned_completion_year',
        'verified_path',
        'collection_stage',
        'notes',
        'sources_display',
        'updated_at',
        'published',
    )
    list_filter = (
        'status',
        'infrastructure_type',
        'initiatives',
        'countries__name',
        'regions',
        HasGeoListFilter,
        'published',
    )
    search_fields = (
        'name',
        'initiatives__name',
        'contacts__given_name',
        'contacts__family_name',
        'funding__sources__name',
        'contractors__name',
        'consultants__name',
        'implementers__name',
        'operators__name',
        'countries__name',
    )
    filter_horizontal = (
        'initiatives',
        'documents',
        'regions',
    )
    actions = [make_published, make_not_published]
    ordering = ['name', 'created_at', 'published']
    readonly_fields = ('extra_data', 'identifier')
    inlines = [
        ProjectFundingInline,
        ProjectOwnersInline,
        ProjectSubstationsInline,
    ]
    raw_id_fields = ('power_plant', )
    list_select_related = ('infrastructure_type', )

    def fieldbook_id(self, obj):
        if obj.extra_data.exists():
            project_id_match = obj.extra_data.filter(dictionary__has_key='project_id').first()
            if project_id_match:
                return project_id_match.dictionary.get('project_id')
        return None
    fieldbook_id.short_description = 'Fieldbook Id'

    def sources_display(self, obj):
        if obj.sources:
            return format_html(
                "<ul>{}</ul>",
                format_html_join('\n', '<li>{}</li>', ((x,) for x in obj.sources))
            )
        return None
    sources_display.short_description = 'Sources'

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super(ProjectAdmin, self).get_search_results(request, queryset, search_term)
        if search_term.lower().startswith('project'):
            queryset |= self.model.objects.filter(extra_data__dictionary__project_id=search_term.title())
        try:
            integer_search_term = int(search_term)
            queryset |= self.model.objects.filter(id=integer_search_term)
        except Exception:
            pass
        return queryset, use_distinct


@admin.register(Initiative)
class InitiativeAdmin(PhraseSearchAdminMixin, MPTTModelAdmin):
    save_on_top = True
    form = InitiativeForm
    prepopulated_fields = {"slug": ("name",)}
    list_display = (
        'name',
        'id',
        'initiative_type',
        'principal_agent',
        'parent',
        'published',
    )
    list_filter = ('geographic_scope', 'initiative_type', 'member_countries', 'published',)
    search_fields = (
        'name',
        'id',
        'member_countries__name',
        'affiliated_people__given_name',
        'affiliated_people__family_name',
        'affiliated_organizations__name',
        'affiliated_events__name',
    )
    filter_horizontal = [
        'related_initiatives',
        'affiliated_people',
        'affiliated_organizations',
        'affiliated_events',
        'documents',
        'geographic_scope',
    ]
    actions = [make_published, make_not_published]
    ordering = ['name', 'created_at', 'published']
    inlines = [
        ProjectsInitiativeInline,
    ]

    class Meta:
        model = Initiative

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super(InitiativeAdmin, self).get_search_results(request, queryset, search_term)
        try:
            integer_search_term = int(search_term)
            queryset |= self.model.objects.filter(id=integer_search_term)
        except Exception:
            pass
        return queryset, use_distinct


@admin.register(PowerPlant)
class PowerPlantAdmin(admin.ModelAdmin):
    save_on_top = True
    form = PowerPlantForm
    prepopulated_fields = {"slug": ("name",)}
    list_display = (
        'name',
        'plant_capacity',
        'infrastructure_type',
        'status',
        'published',
        'sources_display',
    )
    list_filter = (
        'plant_capacity',
        'status',
        'countries__name'
    )
    filter_horizontal = [
        'plant_initiatives',
    ]
    search_fields = ('name', 'plant_capacity', 'notes')
    actions = [make_published, make_not_published]
    inlines = [
        PlantOwnersInline
    ]

    def sources_display(self, obj):
        if obj.sources:
            return format_html(
                "<ul>{}</ul>",
                format_html_join('\n', '<li>{}</li>', ((x,) for x in obj.sources))
            )
        return None
    sources_display.short_description = 'Sources'

    class Meta:
        model = PowerPlant


@admin.register(Fuel)
class FuelAdmin(admin.ModelAdmin):
    save_on_top = True
    list_display = (
        'name',
        'fuel_category'
    )
    list_filter = (
        'name',
        'fuel_category'
    )
    search_fields = ('name', 'fuel_category__name')
    list_select_related = ('fuel_category', )
    ordering = ('name', )


@admin.register(FuelCategory)
class FuelCategoryAdmin(admin.ModelAdmin):
    save_on_top = True
    list_filter = (
        'name',
    )
    search_fields = ('name',)


@admin.register(PlantOwnerStake)
class OwnerStakeAdmin(admin.ModelAdmin):
    save_on_top = True
    form = PlantOwnerStakeForm
    list_display = (
        'id',
        'owner',
        'percent_owned',
        'power_plant',
    )
    list_filter = (
        'owner',
        'power_plant'
    )
    actions = [make_published, make_not_published]
    search_fields = ('owner__name', 'power_plant__name')

    class Meta:
        model = PlantOwnerStake


@admin.register(ProjectOwnerStake)
class ProjectOwnerStakeAdmin(admin.ModelAdmin):
    save_on_top = True
    form = ProjectOwnerStakeForm
    list_display = (
        'id',
        'owner',
        'percent_owned',
        'project'
    )
    list_filter = (
        'owner',
        'project'
    )
    actions = [make_published, make_not_published]
    search_fields = ('owner__name', 'project__name')

    class Meta:
        model = ProjectOwnerStake


@admin.register(InfrastructureType)
class InfrastructureTypeAdmin(admin.ModelAdmin):
    save_on_top = True
    list_display = (
        'name',
        'show_on_map'
    )


@admin.register(ProjectDocument)
class ProjectDocumentAdmin(admin.ModelAdmin):
    list_display = (
        'identifier',
        'document_type',
        'projects_display',
        'source_url',
        'document',
        'status_indicator',
    )
    list_filter = ('document_type', 'status_indicator')
    search_fields = ('source_url', 'notes', 'document__source_file__original_filename')
    inlines = [
        ProjectsDocumentsInline
    ]
    form = ProjectDocumentForm
    list_select_related = ('document__source_file', )

    def get_queryset(self, request):
        # projects_display below iterates through obj.project_set.all(), so this'll cut down on SQL queries
        return super().get_queryset(request).prefetch_related('project_set')

    def projects_display(self, obj):
        if obj.project_set:
            return format_html(
                "<p>{}</p>",
                format_html_join(', ', '<a target="_blank" href="{}" title="{}">Project {}</a>', ((reverse('admin:infrastructure_project_change', args=(x.id,)), x, x.id) for x in obj.project_set.all()))
            )
        return None
    projects_display.short_description = 'Projects'


@admin.register(InitiativeType)
class InitiativeTypeAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


@admin.register(ProjectFunding)
class ProjectFundingAdmin(admin.ModelAdmin):
    form = ProjectFundingForm
    # TODO: Add a list display of sources?
    list_display = ('project', 'amount', 'currency')
    list_editable = ('amount', 'currency')
    list_filter = ('currency',)
    search_fields = (
        'sources__name',
        'project__name',
    )


@admin.register(CuratedProjectCollection)
class CuratedProjectCollectionAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'published',
    )
    filter_horizontal = ('projects', )
