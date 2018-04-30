from django.contrib import admin
from django.db import models

from facts.models.organizations import Organization
from facts.models.people import Position
from facts.admin.events import PersonEventInline
from facts.admin.organizations import PersonShareholderInline
from infrastructure.admin import PersonInitiativeInline
from publish.admin import (
    make_published,
    make_not_published
)
from facts.forms import (NameSearchWidget, PersonForm)


class PositionInline(admin.TabularInline):
    model = Position
    formfield_overrides = {
        models.ForeignKey: {'widget': NameSearchWidget(model=Organization)},
    }

    class Media:
        css = {
            "all": ("admin/css/adminfixes.css",)
        }


class PersonAdmin(admin.ModelAdmin):
    save_on_top = True
    list_display = ('full_display_name', 'birth_year', 'identifier',) + ('published',)
    search_fields = (
        'family_name', 'given_name',
        'events__name',
        'citizenships__name',
    )
    actions = [make_published, make_not_published]
    ordering = ['family_name', 'given_name', 'created_at', 'published']
    list_filter = (
        'published',
    )
    inlines = (
        PositionInline,
        PersonEventInline,
        PersonInitiativeInline,
        PersonShareholderInline
    )
    form = PersonForm
    readonly_fields = ('identifier',)
    fieldsets = (
        (None, {
            'fields': ('published',)
        }),
        ('Basic Details', {
            'fields': (
                'identifier',
                ('given_name', 'family_name'),
                'citizenships',
            )
        }),
        ('Description/Image', {
            'fields': ('description', 'image',)
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Additional personal details', {
            'classes': ('collapse',),
            'fields': (
                ('additional_name', 'birth_year'),
            )
        }),
    )
