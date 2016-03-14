from django.contrib import admin
from facts.models import Person
from facts.models.organizations import Organization
from publish.admin import TEMPORAL_FIELDS


class PersonEventInline(admin.TabularInline):
    model = Person.events.through


class OrganizationEventInline(admin.TabularInline):
    model = Organization.related_events.through


class EventAdmin(admin.ModelAdmin):
    save_on_top = True
    inlines = (
        PersonEventInline,
        OrganizationEventInline
    )
    list_display = ('name', 'start_date', 'end_date') + TEMPORAL_FIELDS
    fieldsets = (
        (None, {
            'fields': ('name', ('start_date', 'end_date'),)
        }),
        (None, {
            'fields': ('description',)
        }),
        (None, {
            'fields': ('documents', 'places')
        }),
    )
