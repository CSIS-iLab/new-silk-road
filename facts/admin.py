from django.contrib import admin
from django import forms
from facts.models import (Person, Organization, Place, Event, Insight, Affiliation,
                          Region, InfrastructureType, Project, Initiative, IntiativeType, COUNTRY_CHOICES)
from markymark.fields import MarkdownFormField


class AffiliationInline(admin.TabularInline):
    model = Affiliation


class AttendanceInline(admin.TabularInline):
    model = Person.events.through


class PersonForm(forms.ModelForm):
    citizenships = forms.TypedMultipleChoiceField(coerce=int, empty_value=None, required=False, choices=COUNTRY_CHOICES)
    biography = MarkdownFormField()

    class Meta:
        model = Person
        fields = '__all__'


class PersonAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'family_name', 'given_name', 'birth_date', 'citizenships_names')
    list_filter = ('family_name',)
    list_editable = ('family_name', 'given_name', 'birth_date')
    inlines = (
        AffiliationInline,
    )
    form = PersonForm
    fieldsets = (
        ('Basic Details', {
            'fields': (('given_name', 'family_name'), ('party',), ('honorific_prefix', 'honorific_suffix'))
        }),
        ('Additonal Name Details', {
            'classes': ('collapse',),
            'description': "Different cultures have different conventions for people's names",
            'fields': ('additional_name', 'patronymic_name', 'name_order')
        }),
        ('Biographical Information', {
            'fields': ('birth_date', 'biography', 'citizenships')
        }),
        ('Taxonomy', {
            'fields': ('tags',)
        }),
        ('Related', {
            'classes': ('collapse',),
            'fields': ('events',)
        })
    )


class EventForm(forms.ModelForm):
    description = MarkdownFormField()


class EventAdmin(admin.ModelAdmin):
    form = EventForm
    inlines = (
        AttendanceInline,
    )


class InsightAdmin(admin.ModelAdmin):
    model = Insight
    list_filter = ('people', 'places', 'organizations', 'events')


class ProjectForm(forms.ModelForm):
    countries = forms.TypedMultipleChoiceField(coerce=int, empty_value=None, required=False, choices=COUNTRY_CHOICES)

    class Meta:
        model = Project
        fields = '__all__'


class ProjectAdmin(admin.ModelAdmin):
    form = ProjectForm


admin.site.register(Person, PersonAdmin)
admin.site.register(Organization)
admin.site.register(Place)
admin.site.register(Affiliation)
admin.site.register(Event, EventAdmin)
admin.site.register(Insight, InsightAdmin)
admin.site.register(Region)
admin.site.register(InfrastructureType)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Initiative)
admin.site.register(IntiativeType)
