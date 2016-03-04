from django import forms
from decimal import Decimal


class PercentageField(forms.DecimalField):
    def __init__(self, *args, **kwargs):
        kwargs['max_value'] = Decimal(100)
        super(PercentageField, self).__init__(*args, **kwargs)
