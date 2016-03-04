from django import forms
from locations.models import COUNTRY_CHOICES


class CountryChoiceField(forms.TypedMultipleChoiceField):
    def __init__(self, *args, **kwargs):
        kwargs['coerce'] = int
        kwargs['empty_value'] = None
        kwargs['choices'] = COUNTRY_CHOICES
        super(CountryChoiceField, self).__init__(*args, **kwargs)
