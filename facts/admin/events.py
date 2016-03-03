from django.contrib import admin
from facts.models.people import Person


class AttendanceInline(admin.TabularInline):
    model = Person.events.through


class EventAdmin(admin.ModelAdmin):
    inlines = (
        AttendanceInline,
    )
