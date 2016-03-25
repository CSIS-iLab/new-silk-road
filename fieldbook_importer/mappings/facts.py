from fieldbook_importer.utils import (
    transform_attr,
    clean_string,
    force_split_string,
    section_from_string,
    instances_for_related_items,
)


def process_people_data(value, recurse=True):
    if isinstance(value, str):
        name_parts = force_split_string(value)
        if name_parts and len(name_parts) > 0:
            yield {
                'given_name': name_parts[0],
                'family_name': section_from_string(value, 1)
            }
    elif isinstance(value, list):
        if recurse:
            for item in value:
                yield from process_people_data(item, recurse=False)


def people_instances(region_var):
    if region_var:
        data_list = process_people_data(region_var)
        objects = instances_for_related_items(
            data_list,
            'facts.Person',
        )
        return list(objects)
    return None


PERSON_MAP = {
    "given_name": transform_attr("points_of_contact_name", section_from_string, 0),
    "family_name": transform_attr("points_of_contact_name", section_from_string, 1),
}

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
