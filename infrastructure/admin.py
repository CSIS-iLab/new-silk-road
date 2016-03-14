from django.contrib import admin
from django import forms
from mptt.admin import MPTTModelAdmin
from infrastructure.models import (
    Project, ProjectDocument, InfrastructureType,
    Initiative, InitiativeType,
)
from locations.fields import CountryMultipleChoiceField


class PersonInitiativeInline(admin.TabularInline):
    model = Initiative.affiliated_people.through


class ProjectForm(forms.ModelForm):
    countries = CountryMultipleChoiceField(required=False)

    class Meta:
        model = Project
        fields = '__all__'


class ProjectAdmin(admin.ModelAdmin):
    form = ProjectForm
    list_display = ('title', 'status', 'infrastructure_type')
    list_filter = ('infrastructure_type',)


class InitiativeAdmin(MPTTModelAdmin):
    class Meta:
        model = Initiative

admin.site.register(InfrastructureType)
admin.site.register(Project, ProjectAdmin)
admin.site.register(ProjectDocument)
admin.site.register(Initiative, InitiativeAdmin)
admin.site.register(InitiativeType)
