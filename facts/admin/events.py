from django.contrib import admin
from facts.models import Person
from facts.models.organizations import Organization
from infrastructure.models import Initiative
from publish.admin import (
    TEMPORAL_FIELDS,
    make_published,
    make_not_published
)


class PersonEventInline(admin.TabularInline):
    model = Person.events.through


class OrganizationEventInline(admin.TabularInline):
    model = Organization.related_events.through


class InitiativeEventInline(admin.TabularInline):
    model = Initiative.affiliated_events.through


class EventAdmin(admin.ModelAdmin):
    save_on_top = True
    search_fields = ['name']
    filter_horizontal = (
        'documents',
        'places',
    )
    inlines = (
        PersonEventInline,
        OrganizationEventInline,
        InitiativeEventInline
    )
    list_display = ('name', 'start_year', 'end_year') + TEMPORAL_FIELDS + ('published',)
    actions = [make_published, make_not_published]
    fieldsets = (
        (None, {
            'fields': ('published',)
        }),
        (None, {
            'fields': (
                ('name', 'slug'),
                ('start_year', 'start_month', 'start_day'),
                ('end_year', 'end_month', 'end_day'),
            )
        }),
        (None, {
            'fields': ('event_type', 'description',)
        }),
        (None, {
            'fields': ('documents', 'places')
        }),
    )
    prepopulated_fields = {"slug": ("name",)}


class EventTypeAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ['name']
