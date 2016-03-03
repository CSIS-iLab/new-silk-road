from django.contrib import admin
from django import forms

from facts.models.infrastructure import Project
from locations.fields import CountryChoiceField


class ProjectForm(forms.ModelForm):
    countries = CountryChoiceField(required=False)

    class Meta:
        model = Project
        fields = '__all__'


class ProjectAdmin(admin.ModelAdmin):
    form = ProjectForm
