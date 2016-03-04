from django import forms
from locations.models import COUNTRY_CHOICES


class CountryMultipleChoiceField(forms.TypedMultipleChoiceField):
    default_help_text = 'Hold down "Control", or "Command" on a Mac, to select more than one.'

    def __init__(self, *args, **kwargs):
        kwargs['coerce'] = int
        kwargs['empty_value'] = None
        kwargs['choices'] = COUNTRY_CHOICES
        if 'help_text' not in kwargs:
            kwargs['help_text'] = CountryMultipleChoiceField.default_help_text
        super(CountryMultipleChoiceField, self).__init__(*args, **kwargs)
