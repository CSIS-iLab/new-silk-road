from django.contrib import admin
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
from infrastructure.forms import InitiativeForm, ProjectForm, ProjectFundingForm


class PersonInitiativeInline(admin.TabularInline):
    model = Initiative.affiliated_people.through


class ProjectFundingInline(admin.TabularInline):
    model = ProjectFunding


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    save_on_top = True
    form = ProjectForm
    prepopulated_fields = {"slug": ("name",)}
    list_display = (
        'name',
        'id',
        'fieldbook_id',
        'initiative',
        'status',
        'infrastructure_type',
        # TODO: Provide some info on operators in list view? Maybe an Ajax popup???
        # 'operators',
        'published',
    )
    list_filter = ('status', 'infrastructure_type', 'initiative', 'countries', 'regions')
    search_fields = (
        'name',
        'id',
        'initiative__name',
        'contacts__given_name',
        'contacts__family_name',
        'funding__name',
        'contractors__name',
        'consultants__name',
        'implementers__name',
        'operators__name',
        'countries__name',
    )
    actions = [make_published, make_not_published]
    ordering = ['name', 'created_at']
    readonly_fields = ('extra_data',)
    inlines = [
        ProjectFundingInline
    ]

    def fieldbook_id(self, obj):
        if obj.extra_data.exists:
            project_id_match = obj.extra_data.filter(dictionary__has_key='project_id').first()
            if project_id_match:
                return project_id_match.dictionary.get('project_id')
        return None
    fieldbook_id.short_description = 'Fieldbook Id'

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super(ProjectAdmin, self).get_search_results(request, queryset, search_term)
        if 'project' in search_term.lower():
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
    actions = [make_published, make_not_published]
    ordering = ['name', 'created_at']

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
        'status_indicator',
        'source_url',
        'document',
    )
    list_filter = ('document_type', 'status_indicator')
    search_fields = ('source_url', 'notes')


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
