from functools import partial
from fieldbook_importer.utils import (
    parse_date,
    choices_from_values,
    values_list,
    make_url_list,
    transform_attr,
    clean_string,
    instances_for_related_items,
    instances_or_none,
    first_of_many
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


def initiative_object(x):
    objects = instances_for_related_items(
        x.get("program_initiative"),
        'infrastructure.Initiative',
        {"name": "program_initiative_name"}
    )
    if objects:
        return first_of_many(objects)
    return None


def initiative_type_object(x):
    objects = instances_for_related_items(
        x.get("initiative_type"),
        'infrastructure.InitiativeType',
        {"name": "initiative_type_name"}
    )
    if objects:
        return first_of_many(objects)
    return None


def process_regions_data(value, recurse=True):
    if isinstance(value, str):
        yield {
            'name': clean_string(value)
        }
    elif isinstance(value, list):
        if recurse:
            for item in value:
                yield from process_regions_data(item, recurse=False)


def document_type_id(value):
    result = ProjectDocument.lookup_document_type_by_name(value)
    if result:
        return result[0]
    return None


CONSULTANT_ORGANIZATION_MAP = make_organization_map("consultant_name")
OPERATOR_ORGANIZATION_MAP = make_organization_map("operator_name")
CONTRACTOR_ORGANIZATION_MAP = make_organization_map("contractors_name")
IMPLEMENTING_AGENCY_ORGANIZATION_MAP = make_organization_map("client_implementing_agency_name")

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

# FIXME: operator_object, should map Organizations to operator fk
# def operator_object(x):
#     objects = instances_for_related_items(
#         x.get("operator"),
#         'facts.Organization',
#         org_map??("operator_name")
#     )
#     if objects:
#         return first_of_many(objects)
#     return None


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
    # "new_reconstruction": None,
    "countries": countries_from_country,
    "infrastructure_type": infrastructure_type_object,
    "initiative": initiative_object,
    # FIXME: An operator is an organization, so make it happen
    # "operator": operator_object,
}


PROJECT_M2M = {
    "regions": lambda x: regions_instances(process_regions_data(x.get('region'))),
    "contacts": lambda x: contacts_instances(x.get('points_of_contact')),
    # Related Organizations
    "consultants": lambda x: consultants_instances(x.get('consultant')),
    "contractors": lambda x: contractors_instances(x.get('contractors')),
    "implementers": lambda x: client_org_instances(x.get('client_implementing_agency')),
    # "documents": lambda x: project_document_instances(x.get('documents')),

}

PROJECT_DOCUMENT_MAP = {
    # "document"
    "document_type": lambda x: document_type_id(x.get('document_type')),
    "source_url": lambda x: x.get('document_name_or_identifier')
    # "notes":
    # NOTE: status_indicator does not appear in Fieldbook data
    # "status_indicator"
}

PROJECT_DOCUMENTS_MESS = {
    # Operational Documents
    "administration_manuals_operational_documents": None,
    "appraisal_documents_operational_documents": None,
    "financial_audits_operational_documents": None,
    "aide_memoires_operational_documents": None,
    "procurement_documents_operational_documents": None,
    "review_approval_documents_operational_documents": None,
    "concept_notes_operational_documents": None,
    # Documents: Agreement/Contracts
    "financing_agreements_agreements_contracts": None,
    "other_agreements_agreements_contracts": None,
    "procurement_contracts_agreements_contracts": None,
    "mou_agreements_contracts": None,
    # Documents: Implementation Progress Reports
    "completion_reports_implementation_and_progress_reports": None,
    "progress_reports_implementation_and_progress_reports": None,
    # Documents: Impact Assessment and Monitoring Reports
    "safeguards_monitoring_reports_impact_assessment_and_monitoring_reports": None,
    "environmental_and_social_assessment_impact_assessment_and_monitoring": None,
    "resettlement_frameworks_impact_assessment_and_monitoring": None,
    "consultation_minutes_impact_assessment_and_monitoring": None,
    # Documents: Public Materials
    "presentations_brochures_public_materials": None,
    "press_releases_public_materials": None,
    "national_development_plans_public_materials": None,
    # Documents; Misc
    "miscellaneous_reports": None
}

METADATA_FIELDS = {
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

OTHER_FIELDS = {
    # distribution_of_funding and sources_of_funding could be
    # a separate table of funders to projects with $ values
    "distribution_of_funding": None,
    "sources_of_funding": None
}

INITIATIVE_MAP = {
    # "first_appearance_of_initiative"
    "name": transform_attr("program_initiative_name", clean_string),
    # TODO: Confirm initiative_type using a dataset that has some...
    "initiative_type": initiative_type_object,
}

INFRASTRUCTURETYPE_MAP = {
    'name': transform_attr("infrastructure_type_name", clean_string),
}
