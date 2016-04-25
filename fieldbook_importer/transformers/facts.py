from django.utils.text import slugify
from datautils.string import clean_string
from nameparser import HumanName
import re
import typing

company_reg = re.compile('(company|corporation|ojsc)')


def make_person_transformer(name_field):
    def transform_person(item):
        name_string = item.get(name_field)
        if not name_string:
            return None
        name = HumanName(name_string)
        return {
            "given_name": name.first,
            "additional_name": name.middle,
            "family_name": name.last
        }
    return transform_person

transform_person_poc = make_person_transformer("points_of_contact_name")


def make_organization_transformer(name_field):
    def transform_organization(item):
        if isinstance(name_field, typing.Iterable) and not isinstance(name_field, str):
            name_values = list(filter(lambda x: item.get(x), name_field))
            if name_values:
                org_name = item.get(name_values[0])
            else:
                return None
        else:
            org_name = clean_string(item.get(name_field))
        return {
            'name': org_name,
            'slug': slugify(org_name, allow_unicode=True)
        }
    return transform_organization

transform_organization = make_organization_transformer("organization_name")


def make_organization_related_transformer(name_field):
    def transform_organization_related_data(item):
        related = {}
        item_name = item.get(name_field)
        if isinstance(item_name, str):
            name_lower = item_name.lower()
            if name_lower.startswith('government'):
                related['facts.GovernmentDetails'] = ('one2one', {})
            elif company_reg.search(name_lower):
                related['facts.CompanyDetails'] = ('one2one', {})
        return related
    return transform_organization_related_data
