from iso4217 import Currency


def make_currency_choices():
    currencies = ((c.code, c.currency_name) for c in Currency)
    return tuple(sorted(currencies, key=lambda x: x[1]))

CURRENCY_CHOICES = make_currency_choices()

DEFAULT_CURRENCY_CHOICE = Currency.usd.code
