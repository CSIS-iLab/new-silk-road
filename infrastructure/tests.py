from django.test import SimpleTestCase
from .forms import MonthField, DayField


class FormFieldTestCase(SimpleTestCase):

    def test_monthfield(self):
        self.assertFieldOutput(
            MonthField,
            {'12': 12},
            {'14': ['Ensure this value is less than or equal to 12.']},
            empty_value=None
        )

    def test_dayfield(self):
        self.assertFieldOutput(
            DayField,
            {'1': 1},
            {'42': ['Ensure this value is less than or equal to 31.']},
            empty_value=None
        )
