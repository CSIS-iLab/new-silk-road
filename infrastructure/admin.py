from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from infrastructure.models import (
    Project, ProjectDocument, InfrastructureType,
    ProjectFunding,
    Initiative, InitiativeType,
)
from publish.admin import (
    TEMPORAL_FIELDS,
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
        'fieldbook_id',
        'initiative',
        'status',
        'infrastructure_type',
        'operator',
        'published',
    )
    list_filter = ('status', 'infrastructure_type', 'initiative', 'countries', 'regions')
    search_fields = (
        'name',
        'initiative__name',
        'contacts__given_name',
        'contacts__family_name',
        'funding__name',
        'contractors__name',
        'consultants__name',
        'implementers__name',
        'operator__name',
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
            project_id_match = obj.extra_data.filter(values__has_key='project_id').first()
            if project_id_match:
                return project_id_match.values.get('project_id')
        return None
    fieldbook_id.short_description = 'Fieldbook Id'

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super(ProjectAdmin, self).get_search_results(request, queryset, search_term)
        if 'project' in search_term.lower():
            queryset |= self.model.objects.filter(extra_data__values__project_id=search_term.title())
        return queryset, use_distinct


@admin.register(Initiative)
class InitiativeAdmin(MPTTModelAdmin):
    save_on_top = True
    form = InitiativeForm
    prepopulated_fields = {"slug": ("name",)}
    list_display = ('name', 'initiative_type',) + TEMPORAL_FIELDS + ('published',)
    list_filter = ('geographic_scope', 'initiative_type', 'member_countries')
    search_fields = ('name',)
    actions = [make_published, make_not_published]
    ordering = ['name', 'created_at']

    class Meta:
        model = Initiative


@admin.register(InfrastructureType)
class InfrastructureTypeAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


@admin.register(ProjectDocument)
class ProjectDocumentAdmin(admin.ModelAdmin):
    list_display = ('identifier', 'document_type', 'status_indicator')
    list_filter = ('document_type', 'status_indicator')
    search_fields = ('source_url', 'notes')


@admin.register(InitiativeType)
class InitiativeTypeAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


@admin.register(ProjectFunding)
class ProjectFundingAdmin(admin.ModelAdmin):
    form = ProjectFundingForm
    list_display = ('source', 'project', 'amount', 'currency')
    list_editable = ('amount', 'currency')
    list_filter = ('source', 'project', 'currency')
    search_fields = ('source', 'project')
