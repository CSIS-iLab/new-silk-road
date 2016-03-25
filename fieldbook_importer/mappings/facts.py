from fieldbook_importer.utils import (
    transform_attr,
    clean_string,
    section_from_string,
)


def make_person_map(name_field):
    return {
        "given_name": transform_attr(name_field, section_from_string, 0),
        "family_name": transform_attr(name_field, section_from_string, 1),
    }

PERSON_POC_MAP = make_person_map("points_of_contact_name")


def make_organization_map(name_field):
    return {
        'name': transform_attr(name_field, clean_string),
    }


ORGANIZATION_MAP = make_organization_map("organization_name")
