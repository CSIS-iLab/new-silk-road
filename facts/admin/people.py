from django.contrib import admin
from django import forms
from django_select2.forms import ModelSelect2MultipleWidget

from facts.models.people import (Person, Position)
from facts.admin.events import PersonEventInline
from facts.admin.organizations import PersonShareholderInline
from infrastructure.admin import PersonInitiativeInline


class PositionInline(admin.TabularInline):
    model = Position


class PersonForm(forms.ModelForm):

    class Meta:
        model = Person
        fields = '__all__'
        widgets = {
            'citizenships': ModelSelect2MultipleWidget
        }


class PersonAdmin(admin.ModelAdmin):
    save_on_top = True
    list_display = ('family_name', 'given_name', 'birth_date', 'identifier',)
    list_filter = ('family_name',)
    inlines = (
        PositionInline,
        PersonEventInline,
        PersonInitiativeInline,
        PersonShareholderInline
    )
    form = PersonForm
    readonly_fields = ('identifier',)
    fieldsets = (
        ('Basic Details', {
            'fields': (
                'identifier',
                ('given_name', 'family_name'),
            )
        }),
        (None, {
            'fields': ('citizenships', 'notes')
        }),
        ('Additional personal details', {
            'classes': ('collapse',),
            'fields': (
                ('additional_name', 'birth_date'),
            )
        }),
    )
