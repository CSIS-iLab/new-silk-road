import datetime
from django.apps import apps
from urllib.parse import urlparse


def parse_date(date_str, fmt='%Y-%m-%d'):
    if not date_str:
        return None
    dt = datetime.datetime.strptime(date_str, fmt)
    return dt.date()


def related_name(obj, relation_field, name_field):
    rel_list = obj.get(relation_field, [])
    if len(rel_list):
        return rel_list[0].get(name_field, None)
    else:
        return None


def find_choice(search_str, choices):
    if not search_str:
        return None
    result = list(value for value, name in choices if name.lower() == search_str.lower())
    if len(result) == 1:
        return result[0]
    else:
        return None


def object_for_model(app_label, model_name, data, create=True):
    model = apps.apps.get_model(app_label, model_name)
    create_method = model.objects.get_or_create if create else model
    instance = create_method(**data)
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


def transform(attr_name, func, default=None):
    def inner_func(obj):
        attr_val = obj.get(attr_name, default) if obj else default
        if not func:
            return attr_val or default
        return func(attr_val) or default
    return inner_func
