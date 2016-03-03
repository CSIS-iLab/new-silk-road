from django.contrib import admin
from django import forms

from facts.models.infrastructure import Project
from facts.models.locations import COUNTRY_CHOICES


class ProjectForm(forms.ModelForm):
    countries = forms.TypedMultipleChoiceField(coerce=int, empty_value=None, required=False, choices=COUNTRY_CHOICES)

    class Meta:
        model = Project
        fields = '__all__'


class ProjectAdmin(admin.ModelAdmin):
    form = ProjectForm
