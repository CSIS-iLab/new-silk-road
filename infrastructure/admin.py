from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from infrastructure.models import (
    Project, ProjectDocument, InfrastructureType,
    ProjectFunding,
    Initiative, InitiativeType,
)
from publish.admin import TEMPORAL_FIELDS
from infrastructure.forms import InitiativeForm, ProjectForm, ProjectFundingForm


class PersonInitiativeInline(admin.TabularInline):
    model = Initiative.affiliated_people.through


class ProjectFundingInline(admin.TabularInline):
    model = ProjectFunding


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    save_on_top = True
    form = ProjectForm
    list_display = ('name', 'status', 'infrastructure_type') + TEMPORAL_FIELDS
    list_filter = ('status', 'infrastructure_type',)
    ordering = ['name', 'created_at']
    inlines = [
        ProjectFundingInline
    ]


@admin.register(Initiative)
class InitiativeAdmin(MPTTModelAdmin):
    save_on_top = True
    form = InitiativeForm
    list_display = ('name', 'initiative_type',) + TEMPORAL_FIELDS
    ordering = ['name', 'created_at']

    class Meta:
        model = Initiative


@admin.register(InfrastructureType)
class InfrastructureTypeAdmin(admin.ModelAdmin):
    pass


@admin.register(ProjectDocument)
class ProjectDocumentAdmin(admin.ModelAdmin):
    pass


@admin.register(InitiativeType)
class InitiativeTypeAdmin(admin.ModelAdmin):
    pass


@admin.register(ProjectFunding)
class ProjectFundingAdmin(admin.ModelAdmin):
    form = ProjectFundingForm
    list_display = ('source', 'project', 'amount', 'currency')
    list_editable = ('source', 'project', 'amount', 'currency')
