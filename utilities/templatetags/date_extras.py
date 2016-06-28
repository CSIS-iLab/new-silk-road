from django import template
from datetime import date

register = template.Library()

MONTH_FORMATS = frozenset(('b', 'B', 'h', 'm'))


@register.filter()
def month(value, arg):
    if arg in MONTH_FORMATS and value:
        fakedate = date(1, value, 1)
        return fakedate.strftime('%{}'.format(arg))
    return None
