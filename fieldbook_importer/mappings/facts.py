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


ORGANIZATION_MAP = {
    'name': transform_attr("organization_name", clean_string),
}

CONSULTANT_ORGANIZATION_MAP = ORGANIZATION_MAP.copy()
CONSULTANT_ORGANIZATION_MAP['name'] = transform_attr("consultant_name", clean_string)

OPERATOR_ORGANIZATION_MAP = ORGANIZATION_MAP.copy()
OPERATOR_ORGANIZATION_MAP['name'] = transform_attr("operator_name", clean_string)

CONTRACTOR_ORGANIZATION_MAP = ORGANIZATION_MAP.copy()
CONTRACTOR_ORGANIZATION_MAP['name'] = transform_attr("contractors_name", clean_string)

IMPLEMENTING_AGENCY_ORGANIZATION_MAP = ORGANIZATION_MAP.copy()
IMPLEMENTING_AGENCY_ORGANIZATION_MAP['name'] = transform_attr("client_implementing_agency_name", clean_string)
