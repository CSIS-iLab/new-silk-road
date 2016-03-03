from django.contrib import admin
from django import forms
from facts.models.people import (Person, Position)
from facts.models.locations import COUNTRY_CHOICES
from facts.admin.events import AttendanceInline


class PositionInline(admin.TabularInline):
    model = Position


class PersonInitiativeInline(admin.TabularInline):
    model = Person.initiatives.through


class PersonForm(forms.ModelForm):
    citizenships = forms.TypedMultipleChoiceField(coerce=int, empty_value=None, required=False, choices=COUNTRY_CHOICES)

    class Meta:
        model = Person
        fields = '__all__'


class PersonAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'family_name', 'given_name', 'citizenships_names', 'birth_date')
    list_filter = ('family_name',)
    inlines = (
        PositionInline,
        AttendanceInline,
        PersonInitiativeInline
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
