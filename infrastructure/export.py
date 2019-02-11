import logging

from django.db import connection, transaction
from infrastructure.models import ProjectStatus, ProjectPlantUnits, PowerPlantStatus


logger = logging.getLogger(__name__)


@transaction.atomic
def refresh_views():
    logger.info("Refreshing PostgreSQL CVS export views")

    project_status_cases = get_statuses(ProjectStatus, 'p')
    power_plant_status_cases = get_statuses(PowerPlantStatus, 'pp')

    project_case_statements = {}
    powerplant_case_statements = {}

    project_unit_fields = (
        'project_output_unit',
        'estimated_project_output_unit',
        'project_capacity_unit',
        'project_CO2_emissions_unit'
    )

    powerplant_unit_fields = (
        'plant_capacity_unit',
        'plant_output_unit',
        'estimated_plant_output_unit',
        'plant_CO2_emissions_unit'
    )

    for field in project_unit_fields:
        project_case_statements[field] = "\n".join([
            """WHEN "{0}"={1} THEN '{2}'""".format(field, *s)
            for s in ProjectPlantUnits.UNITS
        ])

    for field in powerplant_unit_fields:
        powerplant_case_statements[field] = "\n".join([
            """WHEN "{0}"={1} THEN '{2}'""".format(field, *s)
            for s in ProjectPlantUnits.UNITS
        ])
    with connection.cursor() as cursor:
        logger.info("Dropping existing views...")
        database_views = ("infrastructure_regions_view",
                        "infrastructure_countries_view",
                        "infrastructure_initiatives_view",
                        "infrastructure_contractors_view",
                        "infrastructure_consultants_view",
                        "infrastructure_implementers_view",
                        "infrastructure_operators_view",
                        "infrastructure_funding_view",
                        "infrastructure_project_fuels_view",
                        "infrastructure_project_manufacturers_view",
                        "infrastructure_powerplant_countries_view",
                        "infrastructure_powerplant_regions_view",
                        "infrastructure_powerplant_operators_view",
                        "infrastructure_powerplant_owner_stake_view",
                        "infrastructure_projects_export_view",
                        "infrastructure_powerplant_export_view",
                        )
        for view_name in database_views:
            cursor.execute("DROP VIEW IF EXISTS {} CASCADE;".format(view_name))

        logger.info("Creating views...")
        # Project Views #
        cursor.execute('''CREATE OR REPLACE VIEW infrastructure_regions_view AS
                SELECT l.project_id,
                    array_to_string(array_agg(quote_literal(r.name)), ', ', 'NULL') AS regions
                FROM infrastructure_project_regions AS l
                JOIN locations_region AS r
                ON l.region_id = r.id
                GROUP BY l.project_id;
            ''')
        cursor.execute('''CREATE OR REPLACE VIEW infrastructure_countries_view AS
                SELECT l.project_id,
                    array_to_string(array_agg(quote_literal(r.name)), ', ', 'NULL') AS countries
                FROM infrastructure_project_countries AS l
                JOIN locations_country AS r
                ON l.country_id = r.id
                GROUP BY l.project_id;
            ''')
        cursor.execute('''CREATE OR REPLACE VIEW infrastructure_initiatives_view AS
                SELECT l.project_id,
                    array_to_string(array_agg(quote_literal(r.name)), ', ', 'NULL') AS initiatives
                FROM infrastructure_project_initiatives AS l
                JOIN infrastructure_initiative AS r
                ON l.initiative_id = r.id
                GROUP BY l.project_id;
            ''')
        cursor.execute('''CREATE OR REPLACE VIEW infrastructure_contractors_view AS
                SELECT l.project_id,
                    array_to_string(array_agg(quote_literal(r.name)), ', ', 'NULL') AS contractors
                FROM infrastructure_project_contractors AS l
                JOIN facts_organization AS r
                ON l.organization_id = r.id
                GROUP BY l.project_id;
            ''')
        cursor.execute('''CREATE OR REPLACE VIEW infrastructure_consultants_view AS
                SELECT l.project_id,
                    array_to_string(array_agg(quote_literal(r.name)), ', ', 'NULL') AS consultants
                FROM infrastructure_project_consultants AS l
                JOIN facts_organization AS r
                ON l.organization_id = r.id
                GROUP BY l.project_id;
            ''')
        cursor.execute('''CREATE OR REPLACE VIEW infrastructure_implementers_view AS
                SELECT l.project_id,
                    array_to_string(array_agg(quote_literal(r.name)), ', ', 'NULL') AS implementing_agencies
                FROM infrastructure_project_implementers AS l
                JOIN facts_organization AS r
                ON l.organization_id = r.id
                GROUP BY l.project_id;
            ''')
        cursor.execute('''CREATE OR REPLACE VIEW infrastructure_operators_view AS
                SELECT l.project_id,
                    array_to_string(array_agg(quote_literal(r.name)), ', ', 'NULL') AS operators
                FROM infrastructure_project_operators AS l
                JOIN facts_organization AS r
                ON l.organization_id = r.id
                GROUP BY l.project_id;
            ''')
        cursor.execute('''CREATE OR REPLACE VIEW infrastructure_funding_view AS
                SELECT l.project_id,
                    array_to_string(array_agg(quote_literal(org.name)), ' ', 'NULL') AS funding_sources,
                    array_to_string(array_agg(l.amount), ' ', 'NULL') AS funding_amounts,
                    array_to_string(array_agg(l.currency), ' ', 'NULL') AS funding_currencies
                FROM infrastructure_projectfunding AS l
                    LEFT OUTER JOIN infrastructure_projectfunding_sources AS r ON l.id = r.projectfunding_id
                    LEFT OUTER JOIN facts_organization AS org ON r.organization_id = org.id
                GROUP BY l.project_id;
            ''')
        cursor.execute('''CREATE OR REPLACE VIEW infrastructure_project_fuels_view AS
                SELECT ipf.project_id,
                    array_to_string(array_agg(quote_literal(if.name::text)), ','::text, 'NULL'::text) as fuel_type,
                    array_to_string(array_agg(quote_literal(ifc.name::text)), ','::text, 'NULL'::text) as fuel_category
                FROM infrastructure_project_fuels AS ipf
                    LEFT JOIN infrastructure_fuel if ON ipf.fuel_id = if.id
                    LEFT JOIN infrastructure_fuelcategory ifc ON if.fuel_category_id = ifc.id
                GROUP BY ipf.project_id;
            ''')
        cursor.execute('''CREATE OR REPLACE VIEW infrastructure_project_manufacturers_view AS
                SELECT l.project_id,
                    array_to_string(array_agg(quote_literal(r.name)), ', ', 'NULL') AS manufacturers
                FROM infrastructure_project_manufacturers AS l
                    JOIN facts_organization AS r ON l.organization_id = r.id
                GROUP BY l.project_id;
            ''')
        # Power Plant Views
        cursor.execute('''CREATE OR REPLACE VIEW infrastructure_powerplant_countries_view AS
                SELECT l.powerplant_id,
                    array_to_string(array_agg(quote_literal(r.name)), ', ', 'NULL') AS countries
                FROM infrastructure_powerplant_countries AS l
                JOIN locations_country AS r
                ON l.country_id = r.id
                GROUP BY l.powerplant_id;
            ''')
        cursor.execute('''CREATE OR REPLACE VIEW infrastructure_powerplant_regions_view AS
                SELECT l.powerplant_id,
                    array_to_string(array_agg(quote_literal(r.name)), ', ', 'NULL') AS regions
                FROM infrastructure_powerplant_regions AS l
                JOIN locations_region AS r
                ON l.region_id = r.id
                GROUP BY l.powerplant_id;
            ''')
        cursor.execute('''CREATE OR REPLACE VIEW infrastructure_powerplant_operators_view AS
                SELECT l.powerplant_id,
	                array_to_string(array_agg(quote_literal(r."name")), ', ', 'NULL') AS operators
                FROM infrastructure_powerplant_operators AS l
                JOIN facts_organization AS r
                ON l.organization_id = r.id
                GROUP BY l.powerplant_id;
            ''')
        cursor.execute('''CREATE OR REPLACE VIEW infrastructure_powerplant_owner_stake_view AS
                SELECT l.power_plant_id,
                    array_to_string(array_agg(quote_literal(r."name")), ', ', 'NULL') AS owners,
                    array_to_string(array_agg(l."percent_owned"), ', ', 'NULL') AS owners_stake
                FROM infrastructure_plantownerstake AS l
                JOIN facts_organization AS r
                ON l.owner_id = r.id
                GROUP BY l.power_plant_id;
            ''')
        # Export Views

        cursor.execute('''CREATE OR REPLACE VIEW infrastructure_projects_export_view AS
                SELECT
                    identifier,
                    p.name,
                    t.name AS infrastructure_type,
                    related.countries,
                    related.regions,
                    related.contractors,
                    related.initiatives,
                    related.operators,
                    related.funding_sources,
                    related.funding_amounts,
                    related.funding_currencies,
                    related.fuel_type,
                    related.fuel_category,
                    related.consultants,
                    related.implementing_agencies,
                    related.manufacturers,
                    CASE
                        {status_cases}
                        ELSE 'NULL'
                    END
                    status,
                    upper(new::text) as new,
                    upper(verified_path::text) AS verified,
                    p.total_cost,
                    p.total_cost_currency,
                    start_day,
                    start_month,
                    start_year,
                    commencement_day,
                    commencement_month,
                    commencement_year,
                    planned_completion_day,
                    planned_completion_month,
                    planned_completion_year,
                    estimated_project_output, -- 12/28 new export fields start here
                    CASE
                        {estimated_project_output_unit}
                        ELSE 'NULL'
                    END
                    estimated_project_output_unit,
                    nox_reduction_system,
                    power_plant_id,
                    pp.name AS "power_plant_name",
                    "project_CO2_emissions",
                    CASE
                        {project_CO2_emissions_unit}
                        ELSE 'NULL'
                    END
                    "project_CO2_emissions_unit",
                    project_capacity,
                    CASE
                        {project_capacity_unit}
                        ELSE 'NULL'
                    END
                    project_capacity_unit,
                    project_output,
                    CASE
                        {project_output_unit}
                        ELSE 'NULL'
                    END
                    project_output_unit,
                    project_output_year,
                    sox_reduction_system
                FROM
                infrastructure_project AS p
                LEFT OUTER JOIN infrastructure_infrastructuretype AS t ON p.infrastructure_type_id = t.id
                LEFT OUTER JOIN infrastructure_powerplant AS pp ON p.power_plant_id = pp.id
                LEFT OUTER JOIN
                    (
                        SELECT a.project_id,
                            countries,
                            regions,
                            contractors,
                            consultants,
                            operators,
                            implementing_agencies,
                            initiatives,
                            funding_sources,
                            funding_amounts,
                            funding_currencies,
                            fuel_type,
                            fuel_category,
                            manufacturers
                        FROM
                            infrastructure_countries_view AS a
                            LEFT OUTER JOIN infrastructure_initiatives_view ON a.project_id = infrastructure_initiatives_view.project_id
                            LEFT OUTER JOIN infrastructure_regions_view ON a.project_id = infrastructure_regions_view.project_id
                            LEFT OUTER JOIN infrastructure_contractors_view ON a.project_id = infrastructure_contractors_view.project_id
                            LEFT OUTER JOIN infrastructure_consultants_view ON a.project_id = infrastructure_consultants_view.project_id
                            LEFT OUTER JOIN infrastructure_implementers_view ON a.project_id = infrastructure_implementers_view.project_id
                            LEFT OUTER JOIN infrastructure_operators_view ON a.project_id = infrastructure_operators_view.project_id
                            LEFT OUTER JOIN infrastructure_funding_view ON a.project_id = infrastructure_funding_view.project_id
                            LEFT OUTER JOIN infrastructure_project_fuels_view ON a.project_id = infrastructure_project_fuels_view.project_id
                            LEFT OUTER JOIN infrastructure_project_manufacturers_view ON a.project_id = infrastructure_project_manufacturers_view.project_id
                    )
                    AS related
                ON p.id = related.project_id;
            '''.format(status_cases=project_status_cases, **project_case_statements))
        cursor.execute('''CREATE OR REPLACE VIEW infrastructure_powerplant_export_view AS
                SELECT pp.id AS plant_id,
                pp.name AS plant_name,
                icv.countries AS plant_countries,
                irv.regions AS plant_regions,
                ippopv.operators AS plant_operators,
                ipposv.owners AS plant_owners,
                ipposv.owners_stake AS plant_owners_stake,
                pp.slug AS plant_slug,
                CASE
                    {status_cases}
                    ELSE 'NULL'
                END
                AS plant_status,
                array_to_string(pp.sources, ',', 'NULL') as plant_sources,
                pp.total_cost AS plant_total_cost,
                pp.total_cost_currency AS plant_total_cost_currency,
                pp.plant_year_online,
                pp.plant_month_online,
                pp.plant_day_online,
                pp.decommissioning_year AS plant_decommissioning_year,
                pp.decommissioning_month AS plant_decommissioning_month,
                pp.decommissioning_day AS plant_decommissioning_day,
                pp.plant_capacity,
                CASE
                    {plant_capacity_unit}
                    ELSE 'NULL'
                END
                plant_capacity_unit,
                pp.plant_output,
                CASE
                    {plant_output_unit}
                    ELSE 'NULL'
                END
                plant_output_unit,
                pp.plant_output_year,
                pp.estimated_plant_output AS plant_estimated_output,
                CASE
                    {estimated_plant_output_unit}
                    ELSE 'NULL'
                END
                AS plant_estimated_output_unit,
                pp."plant_CO2_emissions",
                CASE
                    {plant_CO2_emissions_unit}
                    ELSE 'NULL'
                END
                plant_CO2_emissions_unit,
                pp.grid_connected AS plant_grid_connected,
                pp.description AS plant_description,
                pp.created_at AS plant_created_at,
                pp.updated_at AS plant_updated_at,
                pp.published AS plant_published
            FROM infrastructure_powerplant pp
                LEFT OUTER JOIN infrastructure_powerplant_countries_view icv ON icv.powerplant_id = pp.id
                LEFT OUTER JOIN infrastructure_powerplant_regions_view irv ON irv.powerplant_id = pp.id
                LEFT OUTER JOIN infrastructure_powerplant_operators_view ippopv ON ippopv.powerplant_id = pp.id
                LEFT OUTER JOIN infrastructure_powerplant_owner_stake_view ipposv ON ipposv.power_plant_id = pp.id
            ORDER BY pp.id
        '''.format(status_cases=power_plant_status_cases, **powerplant_case_statements))
        logger.info("Complete")


def get_statuses(model, table_id):
    '''get_statuses
    converts unit IDs (0, 1, 2) to human-readable strings from a Status model

    Params:
        model: A model following the choices pattern
        table_id: The id of the result table in the view being created
    Returns:
        str

    CAVEAT: The output of this, an SQL CASE statement, is evaluated and solidified into
             the PostgreSQL when _this_ code is executed. This means that if future
             Units are added, they will not automatically be incorporated into
             PosgresSQL view. The view must be recreated.
    '''
    return "\n".join(
        [
        "WHEN {table_id}.status={0} THEN '{1}'"
        .format(table_id=table_id, *s) for s in model.STATUSES
        ]
    )
