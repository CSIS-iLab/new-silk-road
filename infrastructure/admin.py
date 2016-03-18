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
    form = ProjectFundingForm


class ProjectAdmin(admin.ModelAdmin):
    save_on_top = True
    form = ProjectForm
    list_display = ('name', 'status', 'infrastructure_type') + TEMPORAL_FIELDS
    list_filter = ('infrastructure_type',)
    inlines = [
        ProjectFundingInline
    ]


class InitiativeAdmin(MPTTModelAdmin):
    save_on_top = True
    form = InitiativeForm
    list_display = ('name', 'initiative_type',) + TEMPORAL_FIELDS

    class Meta:
        model = Initiative

admin.site.register(InfrastructureType)
admin.site.register(Project, ProjectAdmin)
admin.site.register(ProjectDocument)
admin.site.register(Initiative, InitiativeAdmin)
admin.site.register(InitiativeType)
