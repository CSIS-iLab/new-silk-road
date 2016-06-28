from django import template
from django.utils import dateformat
from datetime import date
from utilities.date import fuzzydate

register = template.Library()

YEAR_FORMATS = 'yYo'
MONTH_FORMATS = 'bEFmMnN'
DAY_FORMATS = 'dDjS'


@register.filter(name='fuzzydate')
def fuzzydate_filter(value, arg):
    '''
    This fuzzydate filter is a formatter for fuzzy dates, with limitations.
    Currently, you must separate format characters by whitespace. No other separators work.
    '''
    def process_format(format_parts, value):
        for part in format_parts:
            if all((p in YEAR_FORMATS for p in part)) and value.year:
                yield part
            elif all((p in MONTH_FORMATS for p in part)) and value.month:
                yield part
            elif all((p in DAY_FORMATS for p in part)) and value.day:
                yield part
    if isinstance(value, fuzzydate):
        format_options = arg.split(' ')
        format_parts = process_format(format_options, value)
        fakedate = value.fillin(date.today())
        return dateformat.format(fakedate, ' '.join(format_parts))
