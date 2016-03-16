from django.contrib import admin
from django import forms
from django_select2.forms import Select2MultipleWidget

from facts.models.people import (Person, Position)
from facts.admin.events import PersonEventInline
from facts.admin.organizations import PersonShareholderInline
from locations.fields import CountryMultipleChoiceField
from infrastructure.admin import PersonInitiativeInline


class PositionInline(admin.TabularInline):
    model = Position


class PersonForm(forms.ModelForm):
    citizenships = CountryMultipleChoiceField(required=False, widget=Select2MultipleWidget)

    class Meta:
        model = Person
        fields = '__all__'


class PersonAdmin(admin.ModelAdmin):
    save_on_top = True
    list_display = ('__str__', 'family_name', 'given_name', 'citizenships_names', 'birth_date')
    list_filter = ('family_name',)
    inlines = (
        PositionInline,
        PersonEventInline,
        PersonInitiativeInline,
        PersonShareholderInline
    )
    form = PersonForm
    fieldsets = (
        ('Basic Details', {
            'fields': (('given_name', 'family_name'),)
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
