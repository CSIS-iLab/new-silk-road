from django.utils.text import slugify
from functools import partial
from datautils.string import clean_string
from fieldbook_importer.utils import (
    choices_from_values,
    values_list,
    first_value_or_none,
    make_url_list,
    instance_for_model,
    instances_for_related_items,
    instances_or_none,
    first_of_many,
    coerce_to_boolean_or_null,
    parse_int
)
from .facts import (
    transform_person_poc,
    make_organization_transformer
)
from infrastructure.models import (
    ProjectStatus,
    ProjectDocument
)


def transform_initiative_data(item):
    name = clean_string(item.get("program_initiative_name"))
    return{
        # "first_appearance_of_initiative"
        "name": name,
        "slug": slugify(name, allow_unicode=True),
        # REVIEW: Confirm initiative_type using a dataset that has some...
        "initiative_type": initiative_type_object(item.get('initiative_type')),
    }


def transform_initiative_type_data(item):
    value = item if isinstance(item, str) else item.get('initiative_type')
    if not value:
        return None
    name = clean_string(value)
    return {"name": name, 'slug': slugify(name, allow_unicode=True)}


def transform_infrastructuretype_data(item):
    name = clean_string(item.get("infrastructure_type_name"))
    return {
        'name': name,
        "slug": slugify(name, allow_unicode=True),
    }


def transform_project_funding_data(item):
    funding_source = item.get("source_of_funding")
    project_id = item.get("project_id")
    if funding_source and project_id:
        return {
            # Organization created via FUNDER_ORGANIZATION_MAP
            "source": funder_from_related_values(funding_source),
            "currency": item.get('currency'),
            "amount": item.get('amount'),
            "project": project_from_related_values(project_id),
        }
    return None


def project_status_from_statuses(x):
    values = values_list(x, "project_status_name")
    if values:
        choices = list(choices_from_values(values, ProjectStatus.STATUSES))
        if len(choices) > 0:
            return choices[0]
    return None


def transform_country(item):
    name = item.get("country_name")
    if not name:
        return None
    country_rename = {
        'Vietnam': 'Viet Nam',
        'Russia': 'Russian Federation',
        'Laos': 'Lao People\'s Democratic Republic',
        'East Timor': 'Timor-Leste'
    }
    if name in country_rename:
        name = country_rename[name]
    return {
        "name": name
    }


def infrastructure_type_object(x):
    objects = instances_for_related_items(
        x,
        'infrastructure.InfrastructureType',
        transform_infrastructuretype_data,
        create=True
    )
    if objects:
        return first_of_many(objects)
    return None


def operator_object(x):
    objects = instances_for_related_items(
        x,
        'facts.Organization',
        # transform
    )
    if objects:
        return first_of_many(objects)
    return None


def initiative_object(x):
    objects = instances_for_related_items(
        x,
        'infrastructure.Initiative',
        transform_initiative_data,
        create=True
    )
    if objects:
        return first_of_many(objects)
    return None


def initiative_type_object(x):
    if x:
        return instance_for_model(
            'infrastructure.InitiativeType',
            transform_initiative_type_data(x),
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


transform_consultant_organization = make_organization_transformer("consultant_name")
transform_operator_organization = make_organization_transformer("operator_name")
transform_contractor_organization = make_organization_transformer("contractors_name")
transform_implementing_agency_organization = make_organization_transformer("client_implementing_agency_name")
transform_funder_organization = make_organization_transformer("sources_of_funding_name")

consultants_instances = partial(
    instances_or_none,
    model_name='facts.Organization',
    transformer=transform_consultant_organization
)

contractors_instances = partial(
    instances_or_none,
    model_name='facts.Organization',
    transformer=transform_contractor_organization
)

client_org_instances = partial(
    instances_or_none,
    model_name='facts.Organization',
    transformer=transform_implementing_agency_organization
)

contacts_instances = partial(
    instances_or_none,
    model_name='facts.Person',
    transformer=transform_person_poc
)

regions_instances = partial(
    instances_or_none,
    model_name='locations.Region',
)


countries_instances = partial(
    instances_or_none,
    model_name='locations.Country',
    transformer=transform_country
)


# Storing that extra data
def extra_project_data(x, create=True):
    values_obj = {
        k: x.get(k, None) for k in ('id', 'project_id', 'points') if x.get(k, None)
    }
    data_obj = {
        'url': x.get('record_url'),
        'dictionary': values_obj,
        'label': "Fieldbook data for '{}'".format(values_obj.get('project_id'))
    }
    return instance_for_model('facts.Data', data_obj, create=True)


def extra_project_data_as_instances(x):
    return [extra_project_data(x)]


def project_via_fieldbook_id(fieldbook_id, project_id):
    '''Lookup using the internal fieldbook id and the user project_id.'''
    lookup = {
        'extra_data__dictionary__id': fieldbook_id,
        'extra_data__dictionary__project_id': project_id
    }
    return instance_for_model('infrastructure.Project', lookup)


def project_from_related_values(value):
    obj = first_value_or_none(value)
    if obj and set(['id', 'project_id']).issubset(obj.keys()):
        return project_via_fieldbook_id(obj['id'], obj['project_id'])
    return None


def funder_from_related_values(value):
    obj = first_value_or_none(value)
    if obj and 'sources_of_funding_name' in obj:
        lookup = {
            'name': obj['sources_of_funding_name']
        }
        return instance_for_model('facts.Organization', lookup, create=True)
    return None


def transform_project_document_data(item):
    return {
        # "document"
        "document_type": document_type_id(item.get('document_type', None)),
        "source_url": clean_string(item.get("document_name_or_identifier", None)),
        # "notes":
        # NOTE: status_indicator does not appear in Fieldbook data
        # "status_indicator"
    }

project_doc_instances = partial(
    instances_or_none,
    model_name='infrastructure.ProjectDocument',
    transformer=transform_project_document_data
)


def transform_project_data(item):
    name = clean_string(item.get("project_title"), default=None)
    return {
        "name": name,
        "slug": slugify(name, allow_unicode=True),
        "start_year": parse_int(item.get("project_start_year")),
        "start_month": parse_int(item.get("project_start_month")),
        "start_day": parse_int(item.get("project_start_day")),
        "status": project_status_from_statuses(item.get("project_status")),
        "sources": make_url_list(item.get("sources")),
        "notes": clean_string(item.get("notes")),
        "commencement_year": parse_int(item.get("commencement_year")),
        "commencement_month": parse_int(item.get("commencement_month")),
        "commencement_day": parse_int(item.get("commencement_day")),
        "total_cost_description": clean_string(item.get("total_project_cost_us")),
        "planned_completion_year": parse_int(item.get("planned_year_of_completion")),
        "planned_completion_month": parse_int(item.get("planned_month_of_completion")),
        "planned_completion_day": parse_int(item.get("planned_day_of_completion")),
        "new": evaluate_project_new_value(item.get("new")),
        "infrastructure_type": infrastructure_type_object(item.get('infrastructure_type')),
        "initiative": initiative_object(item.get('program_initiative')),
        "operator": operator_object(item.get('program_initiative')),
    }


def transform_project_related_data(item):
    return {
        "regions": (
            'm2m',
            regions_instances(process_regions_data(item.get('region')))
        ),
        "contacts": (
            'm2m',
            contacts_instances(item.get('points_of_contact'))
        ),
        "countries": (
            'm2m',
            countries_instances(item.get('country'))
        ),

        # Related Organizations
        "consultants": (
            'm2m',
            consultants_instances(item.get('consultant'))
        ),
        "contractors": (
            'm2m',
            contractors_instances(item.get('contractors'))
        ),
        "implementers": (
            'm2m',
            client_org_instances(item.get('client_implementing_agency'))
        ),
        # Documents
        "documents": (
            'm2m',
            project_doc_instances(item.get('documents'))
        ),
        # Funding comes via ProjectFunding intermediary model
        "extra_data": (
            'm2m',
            extra_project_data_as_instances(item)
        ),
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
