from functools import partial
from fieldbook_importer.utils import (
    parse_date,
    choices_from_values,
    values_list,
    first_value_or_none,
    make_url_list,
    transform_attr,
    clean_string,
    instance_for_model,
    instances_for_related_items,
    instances_or_none,
    first_of_many,
    coerce_to_boolean_or_null
)
from .facts import (
    PERSON_POC_MAP,
    make_organization_map
)
from infrastructure.models import (
    ProjectStatus,
    ProjectDocument
)
from locations.models import COUNTRY_CHOICES


def project_status_from_statuses(x):
    values = values_list(x.get("project_status"), "project_status_name")
    if values:
        choices = list(choices_from_values(values, ProjectStatus.STATUSES))
        if len(choices) > 0:
            return choices[0]
    return None


def countries_from_country(x):
    country_rename = {
        'Vietnam': 'Viet Nam',
        'East Timor': 'Timor-Leste'
    }
    values = values_list(x.get("country"), "country_name")
    values = list(country_rename.get(c, c) for c in values if c)
    if values:
        return list(choices_from_values(values, COUNTRY_CHOICES))
    return []


def infrastructure_type_object(x):
    objects = instances_for_related_items(
        x.get("infrastructure_type"),
        'infrastructure.InfrastructureType',
        {"name": "infrastructure_type_name"}
    )
    if objects:
        return first_of_many(objects)
    return None


def operator_object(x):
    objects = instances_for_related_items(
        x.get("operator"),
        'facts.Organization',
        {"name": "operator_name"}
    )
    if objects:
        return first_of_many(objects)
    return None


def initiative_object(x):
    initiative_obj = x.get("program_initiative")
    objects = instances_for_related_items(
        initiative_obj,
        'infrastructure.Initiative',
        {"name": lambda x: clean_string(x.get('program_initiative_name'))}
    )
    if objects:
        return first_of_many(objects)
    return None


# FIXME: InitiativeType is going to be a string, apparently
def initiative_type_object(x):
    value = x.get('initiative_type', None)
    if value:
        return instance_for_model(
            'infrastructure.InitiativeType',
            {"name": clean_string(value)},
            create=True
        )
    return None


def process_regions_data(value, recurse=True):
    if isinstance(value, str):
        if value.startswith('"') or value.startswith('\''):
            splitchar = value[0]
            regions_raw = [x.strip(',') for x in value.split(splitchar) if x]
            yield from process_regions_data(regions_raw, recurse=True)
        else:
            yield {
                'name': clean_string(value)
            }
    elif isinstance(value, list):
        if recurse:
            for item in value:
                yield from process_regions_data(item, recurse=False)


def document_type_id(value):
    if value:
        result = ProjectDocument.lookup_document_type_by_name(value)
        if result:
            return result[0]
    return None


def evaluate_project_new_value(list_val):
    key = 'new_name'
    raw_value = first_value_or_none(list_val)
    if isinstance(raw_value, dict) and key in raw_value:
        return coerce_to_boolean_or_null(raw_value[key])
    return None


CONSULTANT_ORGANIZATION_MAP = make_organization_map("consultant_name")
OPERATOR_ORGANIZATION_MAP = make_organization_map("operator_name")
CONTRACTOR_ORGANIZATION_MAP = make_organization_map("contractors_name")
IMPLEMENTING_AGENCY_ORGANIZATION_MAP = make_organization_map("client_implementing_agency_name")
FUNDER_ORGANIZATION_MAP = make_organization_map("sources_of_funding_name")

consultants_instances = partial(
    instances_or_none,
    model_name='facts.Organization',
    mapping=CONSULTANT_ORGANIZATION_MAP
)

contractors_instances = partial(
    instances_or_none,
    model_name='facts.Organization',
    mapping=CONTRACTOR_ORGANIZATION_MAP
)

client_org_instances = partial(
    instances_or_none,
    model_name='facts.Organization',
    mapping=IMPLEMENTING_AGENCY_ORGANIZATION_MAP
)

contacts_instances = partial(
    instances_or_none,
    model_name='facts.Person',
    mapping=PERSON_POC_MAP
)

regions_instances = partial(
    instances_or_none,
    model_name='locations.Region',
)


# Storing that extra data
def extra_project_data(x, create=True):
    values_obj = {
        k: x.get(k, None) for k in ('id', 'project_id', 'points',)
    }
    data_obj = {
        'url': x.get('record_url'),
        'values': values_obj,
        'label': "Fieldbook data for '{}'".format(values_obj.get('project_id'))
    }
    return instance_for_model('facts.Data', data_obj, create=True)


def extra_project_data_as_instances(x):
    return [extra_project_data(x)]


def project_via_fieldbook_id(fieldbook_id):
    lookup = {
        'extra_data__values__id': fieldbook_id
    }
    return instance_for_model('infrastructure.Project', lookup)


def project_from_related_values(value):
    obj = first_value_or_none(value)
    if obj and 'id' in obj:
        return project_via_fieldbook_id(obj['id'])
    return None


def funder_from_related_values(value):
    obj = first_value_or_none(value)
    if obj and 'sources_of_funding_name' in obj:
        lookup = {
            'name': obj['sources_of_funding_name']
        }
        return instance_for_model('facts.Organization', lookup)
    return None


PROJECT_DOCUMENT_MAP = {
    # "document"
    "document_type": lambda x: document_type_id(x.get('document_type')),
    "source_url": transform_attr("document_name_or_identifier", clean_string)
    # "notes":
    # NOTE: status_indicator does not appear in Fieldbook data
    # "status_indicator"
}

project_doc_instances = partial(
    instances_or_none,
    model_name='infrastructure.ProjectDocument',
    mapping={
        "source_url": transform_attr("document_name_or_identifier", clean_string)
    }
)


PROJECT_MAP = {
    "name": transform_attr("project_title", clean_string),
    "start_date": transform_attr("project_start_date", parse_date),
    # "project_id": None,
    "status": project_status_from_statuses,
    "sources": transform_attr("sources", make_url_list),
    "notes": transform_attr("notes", clean_string),
    "commencement_date": transform_attr("commencement_date", parse_date),
    "total_cost_description": transform_attr("total_project_cost_us", clean_string),
    "planned_completion_date": transform_attr("planned_date_of_completion", parse_date),
    "new": transform_attr("new", evaluate_project_new_value),
    "countries": countries_from_country,
    "infrastructure_type": infrastructure_type_object,
    "initiative": initiative_object,
    # REVIEW: An operator is an organization, so make it happen
    "operator": operator_object,
}


PROJECT_M2M = {
    "regions": lambda x: regions_instances(process_regions_data(x.get('region'))),
    "contacts": lambda x: contacts_instances(x.get('points_of_contact')),
    # Related Organizations
    "consultants": lambda x: consultants_instances(x.get('consultant')),
    "contractors": lambda x: contractors_instances(x.get('contractors')),
    "implementers": lambda x: client_org_instances(x.get('client_implementing_agency')),
    # Documents
    "documents": lambda x: project_doc_instances(x.get('documents')),
    # Funding comes via ProjectFunding intermediary model
    "extra_data": lambda x: extra_project_data_as_instances(x),
}

PROJECT_METADATA_FIELDS = {
    "date_last_updated": None,
    "collection_stage": None,
    "processed": None,
    "verified_path": None,
}

FIELDBOOK_FIELDS = {
    "id": None,
    "record_url": None,
}

IGNORABLE_FIELDS = {
    "points": None,
    "field_49": None,
    "documentation_all_types": None,  # Repeat of stuff in other fields?
    "first_appearance_of_initiative_date": None,  # No data in SE Asia
}

INITIATIVE_MAP = {
    # "first_appearance_of_initiative"
    "name": transform_attr("program_initiative_name", clean_string),
    # REVIEW: Confirm initiative_type using a dataset that has some...
    "initiative_type": initiative_type_object,
}

INFRASTRUCTURETYPE_MAP = {
    'name': transform_attr("infrastructure_type_name", clean_string),
}


PROJECT_FUNDING_MAP = {
    # Organization created via FUNDER_ORGANIZATION_MAP
    "source": transform_attr("source_of_funding", funder_from_related_values),
    "currency": lambda x: x.get('currency', None),
    "amount": lambda x: x.get('amount', None),
    "project": transform_attr("project_id", project_from_related_values),  # Project via project_id in fieldbook
}
