from .utils import (
    parse_date,
    choices_from_values,
    values_list,
    make_url_list,
    transform_attr,
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
        'Vietnam': 'Viet Nam'
    }
    values = values_list(x.get("country"), "country_name")
    values = list(country_rename.get(c, c) for c in country_rename)
    if values:
        return list(choices_from_values(values, COUNTRY_CHOICES))
    return []


PROJECT_MODEL_MAP = (
    ("name", lambda x: x.get("project_title")),
    ("start_date", transform_attr("project_start_date", parse_date)),
    (None, "project_id"),
    ("status", project_status_from_statuses),
    ("sources", transform_attr("sources", make_url_list)),
    ("notes", lambda x: x.get("notes", "")),
    ("commencement_date", transform_attr("commencement_date", parse_date)),
    ("total_cost_description", lambda x: x.get("total_project_cost_us", "")),
    ("planned_completion_date", transform_attr("planned_date_of_completion", parse_date)),
    (None, "new_reconstruction"),
    ("countries", countries_from_country),

)

METADATA_FIELDS = {
    "date_last_updated": None,
    "collection_stage": None,
    "processed": None,
    "verified_path": None,
}

PROJECT_RELATIONAL_FIELDS = {
    "program_initiative": ("initiative", None),
    "consultant": ("consultants", None),
    "operator": ("operator", None),
    "region": ("regions", None),
    "infrastructure_type": ("infrastructure_type", None),
    "points_of_contact": ("contacts", None),
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
