from django import template
from django.template.defaultfilters import stringfilter
from django.http import QueryDict
from urllib.parse import urlsplit, urlunsplit
from search.utils import FACET_NAME_TRANSLATOR

register = template.Library()


@register.simple_tag
def modify_urlquery(in_url, **kwargs):
    """Modify the query part of a URL.
    Supplying delete=True will remove all matching parameters matching the value.
    """
    safe = kwargs.pop('safe', None)
    delete = kwargs.pop('delete', False)

    scheme, netloc, path, query, fragment = urlsplit(in_url)
    q_dict = QueryDict(query, mutable=True)
    for k, v in kwargs.items():
        param_list = q_dict.getlist(k)
        if delete:
            q_dict.setlist(k, [x for x in param_list if x != v])
        else:
            if v not in param_list:
                q_dict.appendlist(k, v)

    return urlunsplit((scheme, netloc, path, q_dict.urlencode(safe=safe), fragment))


@register.filter
@stringfilter
def facettitle(value):
    value = value.translate(FACET_NAME_TRANSLATOR).strip()
    if value.endswith('name'):
        left = value.rsplit('name')[0].strip()
        if left.endswith('s'):
            value = left
    return value.title()


@register.filter
@stringfilter
def cleanhighlight(value):
    value = value.strip(',.;:\'\"')
    if value.startswith(' '):
        value = "&hellip;{}".format(value.lstrip())
    if ' ' in value and not value.endswith('.') and not value.endswith('>'):
        value = "{}&hellip;".format(value.rstrip())
    return value
