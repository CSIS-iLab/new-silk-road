from django.contrib import admin
from django.db import models
from django.utils.html import format_html, format_html_join
from django.core.urlresolvers import reverse
from mptt.admin import MPTTModelAdmin
from infrastructure.models import (
    Project, ProjectDocument, InfrastructureType,
    ProjectFunding,
    Initiative, InitiativeType,
)
from publish.admin import (
    make_published,
    make_not_published
)
from infrastructure.forms import (
    InitiativeForm,
    ProjectForm,
    ProjectFundingForm
)
from facts.forms import NameSearchWidget


class PersonInitiativeInline(admin.StackedInline):
    model = Initiative.affiliated_people.through


class ProjectFundingInline(admin.StackedInline):
    model = ProjectFunding
    filter_horizontal = (
        'sources',
    )


class ProjectsInitiativeInline(admin.StackedInline):
    model = Project.initiatives.through
    formfield_overrides = {
        models.ForeignKey: {'widget': NameSearchWidget(attrs={'style': 'width: 80%;'})},
    }


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    save_on_top = True
    form = ProjectForm
    prepopulated_fields = {"slug": ("name",)}
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
        'countries',
        'regions',
    )
    search_fields = (
        'name',
        'initiatives__name',
        'contacts__given_name',
        'contacts__family_name',
        'projectfunding__sources__name',
        'contractors__name',
        'consultants__name',
        'implementers__name',
        'operators__name',
        'countries__name',
    )
    filter_horizontal = (
        'initiatives',
        'contractors',
        'consultants',
        'implementers',
        'operators',
        'documents',
        'regions',
    )
    actions = [make_published, make_not_published]
    ordering = ['name', 'created_at']
    readonly_fields = ('extra_data',)
    inlines = [
        ProjectFundingInline
    ]

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
class InitiativeAdmin(MPTTModelAdmin):
    save_on_top = True
    form = InitiativeForm
    prepopulated_fields = {"slug": ("name",)}
    list_display = (
        'name',
        'id',
        'initiative_type',
        'principal_agent',
        'parent',
        'geographic_scope',
        'published',
    )
    list_filter = ('geographic_scope', 'initiative_type', 'member_countries')
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
        'affiliated_people',
        'affiliated_organizations',
        'affiliated_events'
    ]
    actions = [make_published, make_not_published]
    ordering = ['name', 'created_at']
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


@admin.register(InfrastructureType)
class InfrastructureTypeAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


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
    search_fields = ('source_url', 'notes')

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
