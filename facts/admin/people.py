from django.contrib import admin
from django import forms
from django.db import models

from facts.models.people import (Person, Position)
from facts.admin.events import PersonEventInline
from facts.admin.organizations import PersonShareholderInline
from infrastructure.admin import PersonInitiativeInline
from locations.models import Country
from locations.forms import CountrySearchMultiField
from publish.admin import (
    make_published,
    make_not_published
)
from facts.forms import NameSearchWidget


class PositionInline(admin.TabularInline):
    model = Position
    formfield_overrides = {
        models.ForeignKey: {'widget': NameSearchWidget()},
    }

    class Media:
        css = {
            "all": ("admin/css/adminfixes.css",)
        }


class PersonForm(forms.ModelForm):
    citizenships = CountrySearchMultiField(
        required=False,
        queryset=Country.objects.all(),
        help_text=CountrySearchMultiField.help_text
    )

    class Meta:
        model = Person
        fields = '__all__'


class PersonAdmin(admin.ModelAdmin):
    save_on_top = True
    list_display = ('full_display_name', 'birth_year', 'identifier',) + ('published',)
    search_fields = (
        'family_name', 'given_name',
        'events__name',
        'citizenships__name',
    )
    actions = [make_published, make_not_published]
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
                ('additional_name', 'birth_year'),
            )
        }),
    )
