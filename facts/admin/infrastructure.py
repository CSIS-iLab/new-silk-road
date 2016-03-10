from django.contrib import admin
from django import forms

from facts.models.infrastructure import Project
from locations.fields import CountryMultipleChoiceField


class ProjectForm(forms.ModelForm):
    countries = CountryMultipleChoiceField(required=False)

    class Meta:
        model = Project
        fields = '__all__'


class ProjectAdmin(admin.ModelAdmin):
    form = ProjectForm
    list_display = ('title', 'status', 'infrastructure_type')
    list_filter = ('infrastructure_type',)
