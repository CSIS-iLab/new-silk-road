from django import template
from django.http import QueryDict
from urllib.parse import urlsplit, urlunsplit

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
