from iso4217 import Currency
from django.test import TestCase

from ..currency import make_currency_choices


class MakeCurrencyChoicesTestCase(TestCase):
    """Test case for the make_currency_choices() function."""

    def test_make_currency_choices(self):
        """The make_currency_choices() function returns data about all currencies from iso4217."""
        results = make_currency_choices()

        self.assertEqual(len(results), len([c for c in Currency]))
        # The first part of each of the results matches each currency code from iso4217
        self.assertEqual(
            set([choice[0] for choice in make_currency_choices()]),
            set([c.code for c in Currency])
        )
        # The second part of each of the results matches each currency code from iso4217
        self.assertEqual(
            set([choice[0] for choice in make_currency_choices()]),
            set([c.code for c in Currency])
        )
