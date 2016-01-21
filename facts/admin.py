from django.contrib import admin
from django import forms
from facts.models import Person, Organization, Place, Event, COUNTRY_CHOICES


class PersonForm(forms.ModelForm):
    citizenships = forms.TypedMultipleChoiceField(coerce=int, empty_value=None, choices=COUNTRY_CHOICES)

    class Meta:
        model = Person
        fields = '__all__'


class PersonAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'family_name', 'given_name', 'citizenships_names')
    form = PersonForm

admin.site.register(Person, PersonAdmin)
admin.site.register(Organization)
admin.site.register(Place)
admin.site.register(Event)
