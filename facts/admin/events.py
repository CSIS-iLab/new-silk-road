from django.contrib import admin
from facts.models.people import Person


class AttendanceInline(admin.TabularInline):
    model = Person.events.through


class EventAdmin(admin.ModelAdmin):
    save_on_top = True
    inlines = (
        AttendanceInline,
    )
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
