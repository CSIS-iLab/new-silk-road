from django.contrib import admin
from django import forms
from facts.models import Person


class PersonForm(forms.ModelForm):
    citizenships = forms.TypedMultipleChoiceField(coerce=int, empty_value=None, choices=Person.COUNTRY_CHOICES)

    class Meta:
        model = Person
        fields = '__all__'


class PersonAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'family_name', 'given_name', 'citizenships_names')
    form = PersonForm

admin.site.register(Person, PersonAdmin)
