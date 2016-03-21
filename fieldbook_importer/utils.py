import datetime
from django.apps import apps
from django.core.exceptions import ObjectDoesNotExist
from urllib.parse import urlparse


def parse_date(date_str, fmt='%Y-%m-%d'):
    if not date_str:
        return None
    dt = datetime.datetime.strptime(date_str, fmt)
    return dt.date()


def values_list(l, field_name, default=None):
    for i in l:
        yield i.get(field_name, default)


def find_choice(search_str, choices):
    if not search_str:
        return None
    result = list(value for value, name in choices if name.lower() == search_str.lower())
    if len(result) == 1:
        return result[0]
    else:
        return None


def choices_from_values(values, choices):
    for v in values:
        yield find_choice(v, choices)


def instance_for_model(app_label, model_name, data):
    model = apps.get_model(app_label, model_name)
    try:
        instance = model.objects.get(**data)
    except ObjectDoesNotExist:
        instance = model(**data)
    return instance


def make_list(list_str, sep=","):
    if not list_str:
        return None
    return [s.strip() for s in list_str.split(sep)]


def clean_url(url):
    parsed = urlparse(url)
    if not parsed.scheme:
        url = "http://{}".format(url)
    return url


def make_url_list(list_str, sep=","):
    str_list = make_list(list_str, sep)
    if str_list:
        return [clean_url(x) for x in str_list if x]
    else:
        return None


def transform_attr(attr_name, func, *args, **kwargs):
    def inner_func(obj):
        attr_val = obj.get(attr_name, None) if obj else None
        if not func:
            return attr_val
        return func(attr_val, *args, **kwargs)
    return inner_func


def coerce_to_empty_string(value):
    if value is not None:
        return value
    return ""
