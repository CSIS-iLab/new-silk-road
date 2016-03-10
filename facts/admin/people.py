from django.contrib import admin
from django import forms
from facts.models.people import (Person, Position)
from facts.admin.events import PersonEventInline
from facts.admin.organizations import PersonShareholderInline
from locations.fields import CountryMultipleChoiceField


class PositionInline(admin.TabularInline):
    model = Position


class PersonInitiativeInline(admin.TabularInline):
    model = Person.initiatives.through


class PersonForm(forms.ModelForm):
    citizenships = CountryMultipleChoiceField()

    class Meta:
        model = Person
        fields = '__all__'


class PersonAdmin(admin.ModelAdmin):
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
        ('Related', {
            'classes': ('collapse',),
            'fields': ('events',)
        }),
        ('Additional personal details', {
            'classes': ('collapse',),
            'fields': (
                ('additional_name', 'birth_date'),
            )
        }),
    )
