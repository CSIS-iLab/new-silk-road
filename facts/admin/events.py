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
    search_fields = ['name']
    inlines = (
        PersonEventInline,
        OrganizationEventInline
    )
    list_display = ('name', 'start_date', 'end_date') + TEMPORAL_FIELDS + ('published',)
    fieldsets = (
        (None, {
            'fields': (('name', 'slug'), ('start_date', 'end_date'),)
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
