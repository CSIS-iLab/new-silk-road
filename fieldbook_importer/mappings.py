from .utils import (
    get_mapper,
    parse_date,
    choices_from_values,
    values_list,
    make_url_list,
    transform_attr,
    instance_for_model,
    coerce_to_string,
    section_from_string,
    instances_for_related_items,
    first_of_many
)
from infrastructure.models import ProjectStatus
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
    values = list(country_rename.get(c, c) for c in country_rename if c)
    if values:
        return list(choices_from_values(values, COUNTRY_CHOICES))
    return []


def infrastructure_type_object(x):
    objects = instances_for_related_items(
        x.get("infrastructure_type"),
        'infrastructure.InfrastructureType',
        { "name": "infrastructure_type_name" }
    )
    if objects:
        return first_of_many(objects)
    return None


def initiative_object(x):
    objects = instances_for_related_items(
        x.get("program_initiative"),
        'infrastructure.Initiative',
        { "name": "program_initiative_name" }
    )
    if objects:
        return first_of_many(objects)
    return None


def initiative_type_object(x):
    objects = instances_for_related_items(
        x.get("initiative_type"),
        'infrastructure.InitiativeType',
        { "name": "initiative_type_name" }
    )
    if objects:
        return first_of_many(objects)
    return None


PERSON_MAP = {
    "given_name": transform_attr("points_of_contact_name", section_from_string, 0),
    "family_name": transform_attr("points_of_contact_name", section_from_string, 1),
}

PROJECT_MAP = {
    "name": transform_attr("project_title", coerce_to_string),
    "start_date": transform_attr("project_start_date", parse_date),
    # "project_id": None,
    "status": project_status_from_statuses,
    "sources": transform_attr("sources", make_url_list),
    "notes": transform_attr("notes", coerce_to_string),
    "commencement_date": transform_attr("commencement_date", parse_date),
    "total_cost_description": transform_attr("total_project_cost_us", coerce_to_string),
    "planned_completion_date": transform_attr("planned_date_of_completion", parse_date),
    # "new_reconstruction": None,
    "countries": countries_from_country,
    "infrastructure_type": infrastructure_type_object,
    "initiative": initiative_object,
}

PROJECT_RELATED_MAP = {
    # "contacts": transform_attr(
    #     "points_of_contact",
    #     instances_for_related_items,
    #     'facts.Person',
    #     get_mapper(PERSON_MAP)
    # )
    # "consultant": ("consultants", None),
    # "operator": ("operator", None),
    # "points_of_contact": ("contacts", None),
}

METADATA_FIELDS = {
    "date_last_updated": None,
    "collection_stage": None,
    "processed": None,
    "verified_path": None,
}

PROJECT_RELATIONAL_FIELDS = {
    "region": ("regions", None),
    # Related Organizations
    "contractors": None,
    "client_implementing_agency": None,
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
    "miscellaneous_reports": None,
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
    "name": transform_attr("program_initiative_name", coerce_to_string),
    "initiative_type": initiative_type_object,
}


# Other models

INFRASTRUCTURETYPE_MAP = {
    'name': transform_attr("infrastructure_type_name", coerce_to_string),
}

ORGANIZATION_MAP = {
    'name': transform_attr("organization_name", coerce_to_string),
}

CONSULTANT_ORGANIZATION_MAP = ORGANIZATION_MAP.copy()
CONSULTANT_ORGANIZATION_MAP['name'] = transform_attr("consultant_name", coerce_to_string)

OPERATOR_ORGANIZATION_MAP = ORGANIZATION_MAP.copy()
OPERATOR_ORGANIZATION_MAP['name'] = transform_attr("operator_name", coerce_to_string)

CONTRACTOR_ORGANIZATION_MAP = ORGANIZATION_MAP.copy()
CONTRACTOR_ORGANIZATION_MAP['name'] = transform_attr("contractors_name", coerce_to_string)

IMPLEMENTING_AGENCY_ORGANIZATION_MAP = ORGANIZATION_MAP.copy()
IMPLEMENTING_AGENCY_ORGANIZATION_MAP['name'] = transform_attr("client_implementing_agency_name", coerce_to_string)
