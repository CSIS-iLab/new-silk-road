from django import template
from django.template.defaultfilters import stringfilter
from django.http import QueryDict
from urllib.parse import urlsplit, urlunsplit

register = template.Library()


@register.filter(name='to_whitespace')
@stringfilter
def to_whitespace(value, arg):
    trans_tbl = value.maketrans({x: ' ' for x in str(arg)})
    return value.translate(trans_tbl).strip()


@register.simple_tag
def query_url(in_url, **kwargs):
    safe = kwargs.pop('safe', None)
    scheme, netloc, path, query, fragment = urlsplit(in_url)
    q_dict = QueryDict(query, mutable=True)
    for k, v in kwargs.items():
        if v not in q_dict.getlist(k):
            q_dict.appendlist(k, v)
    print(in_url)
    print(query)
    print(q_dict)

    return urlunsplit((scheme, netloc, path, q_dict.urlencode(safe=safe), fragment))


@register.simple_tag
def join_parts(*args, sep=':'):
    return sep.join((str(x) for x in args))
