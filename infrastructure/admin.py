from django.contrib import admin
from django import forms
from mptt.admin import MPTTModelAdmin
from infrastructure.models import (
    Project, ProjectDocument, InfrastructureType,
    Initiative, InitiativeType,
)
from locations.fields import CountryMultipleChoiceField
from publish.admin import TEMPORAL_FIELDS


class PersonInitiativeInline(admin.TabularInline):
    model = Initiative.affiliated_people.through


class InitiativeForm(forms.ModelForm):
    member_countries = CountryMultipleChoiceField(required=False)

    class Meta:
        model = Initiative
        fields = '__all__'


class ProjectForm(forms.ModelForm):
    countries = CountryMultipleChoiceField(required=False)

    class Meta:
        model = Project
        fields = '__all__'


class ProjectAdmin(admin.ModelAdmin):
    save_on_top = True
    form = ProjectForm
    list_display = ('name', 'status', 'infrastructure_type') + TEMPORAL_FIELDS
    list_filter = ('infrastructure_type',)


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
