from django.contrib import admin
from django import forms
from django_select2.forms import ModelSelect2MultipleWidget

from facts.models.people import (Person, Position)
from facts.admin.events import PersonEventInline
from facts.admin.organizations import PersonShareholderInline
from infrastructure.admin import PersonInitiativeInline
from locations.models import Country
from publish.admin import (
    make_published,
    make_not_published
)


class PositionInline(admin.TabularInline):
    model = Position


class CountrySearchMultiWidget(ModelSelect2MultipleWidget):
    model = Country
    search_fields = [
        'name__icontains',
        'alpha_3__iexact',
    ]


class PersonForm(forms.ModelForm):

    class Meta:
        model = Person
        fields = '__all__'
        widgets = {
            'citizenships': CountrySearchMultiWidget
        }


class PersonAdmin(admin.ModelAdmin):
    save_on_top = True
    list_display = ('full_display_name', 'birth_date', 'identifier',) + ('published',)
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
                ('additional_name', 'birth_date'),
            )
        }),
    )
