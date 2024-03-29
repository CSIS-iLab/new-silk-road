from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.urlresolvers import reverse
from django.utils.text import slugify
from publish.models import Publishable, Temporal, PublishableQuerySet
from mptt.models import MPTTModel, TreeForeignKey
from markymark.fields import MarkdownField
from markymark.utils import render_markdown
from finance.currency import CURRENCY_CHOICES, DEFAULT_CURRENCY_CHOICE
from utilities.validators import URLLikeValidator
from utilities.date import fuzzydate
import uuid


class InfrastructureType(models.Model):
    """Type of infrastructure"""

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=110, allow_unicode=True)
    show_on_map = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class PlantOwnerStake(models.Model):
    """ Percentage that owners own and also relation with PowerPlant and Organization """
    power_plant = models.ForeignKey(
        'PowerPlant',
        models.CASCADE,
        related_name='plant_owner_stakes'
    )
    owner = models.ForeignKey(
        'facts.Organization',
        models.CASCADE,
        related_name='plant_owners_stakes'
    )
    percent_owned = models.FloatField(blank=True, null=True)

    def __str__(self):
        return "{} stake in {}".format(self.owner, self.power_plant)


class ProjectOwnerStake(models.Model):
    """Percentage that owners own and also relation with Projects and Organization"""
    project = models.ForeignKey(
        'Project',
        models.CASCADE,
        related_name='project_owner_stakes'
    )
    owner = models.ForeignKey(
        'facts.Organization',
        models.CASCADE,
        related_name='project_owners_stakes'
    )
    percent_owned = models.FloatField(blank=True, null=True)

    def __str__(self):
        return "{} stake in {}".format(self.owner, self.project)


class ProjectFunding(Temporal):
    """ProjectFunding relates Organizations to projects they fund, with amounts"""

    sources = models.ManyToManyField('facts.Organization', blank=True)
    project = models.ForeignKey('Project', models.CASCADE, related_name='funding')
    amount = models.BigIntegerField(
        blank=True, null=True, help_text="Values in whole units (dollars, etc.)"
    )
    currency = models.CharField(
        blank=True,
        null=True,
        max_length=3,
        choices=CURRENCY_CHOICES,
        default=DEFAULT_CURRENCY_CHOICE,
    )

    class Meta:
        verbose_name_plural = 'project funders'
        ordering = ['project__name', 'created_at']

    def __str__(self):
        return "{} {}".format(self.amount or None, self.currency)

# ----- CHOICES CLASSES ----- #


class PowerPlantStatus:
    ACTIVE = 1
    PARTIALLY_ACTIVE = 2
    INACTIVE = 3

    STATUSES = ((ACTIVE, 'Active'), (PARTIALLY_ACTIVE, 'Partially Active'), (INACTIVE, 'Inactive'))


class ProjectStatus:
    ANNOUNCED = 1
    PREPATORY = 2
    STARTED = 3
    UNDER_CONSTRUCTION = 4
    COMPLETED = 5
    CANCELLED = 6
    DECOMMISSIONED = 7
    SUSPENDED = 8

    STATUSES = (
        (ANNOUNCED, 'Announced/Under Negotiation'),
        (PREPATORY, 'Preparatory Works'),
        (STARTED, 'Started'),
        (UNDER_CONSTRUCTION, 'Under Construction'),
        (COMPLETED, 'Completed'),
        (CANCELLED, 'Cancelled'),
        (DECOMMISSIONED, 'Decommissioned'),
        (SUSPENDED, 'Suspended'),
    )


class ProjectCapacityUnits:
    MEGAWATTS = 'mw'
    BARRELS = 'barrels'
    TONS = 'tons'
    CUBIC_FT = 'cubic-feet'
    CUBIC_METERS = 'cubic-meters'

    UNITS = (
        (MEGAWATTS, 'MW'),
        (BARRELS, 'Barrels'),
        (TONS, 'Tons'),
        (CUBIC_FT, 'cubic feet'),
        (CUBIC_METERS, 'cubic meters'),
    )


class ProjectThroughputUnits:
    BARRELS = 'barrels'
    TONS = 'tons'
    CUBIC_FT = 'cubic-feet'
    CUBIC_METERS = 'cubic-meters'

    UNITS = (
        (BARRELS, 'Barrels'),
        (TONS, 'Tons'),
        (CUBIC_FT, 'cubic feet'),
        (CUBIC_METERS, 'cubic meters'),
    )


class ProjectTimeFrameUnits:
    PER_HOUR = 'per-hour'
    PER_DAY = 'per-day'
    PER_MONTH = 'per-month'
    PER_YEAR = 'per-year'

    TIME_UNITS = (
        (PER_HOUR, 'per hour'),
        (PER_DAY, 'per day'),
        (PER_MONTH, 'per month'),
        (PER_YEAR, 'per year'),
    )


class ProjectPlantUnits:
    MEGAWATTHOUR = 0
    MEGAWATT = 1
    TONNESPERANNUM = 2

    UNITS = ((MEGAWATTHOUR, 'MWh'), (MEGAWATT, 'MW'), (TONNESPERANNUM, 'Tonnes per annum'))


class CollectionStage(object):
    IDENTIFIED = 1
    COLLECTED = 2
    STAGES = ((IDENTIFIED, 'Identified'), (COLLECTED, 'Collected'))


class PipelineDiameters:
    INCHES = 'inches'
    MILLIMETERS = 'mm'

    UNITS = (
        (INCHES, 'inches'),
        (MILLIMETERS, 'mm'),
    )

# ----- END CHOICES CLASSES ----- #


class Project(Publishable):
    """Describes a project"""

    # ---- STANDARD FIELDS ---- #
    identifier = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField("Project name/title", max_length=300)
    slug = models.SlugField(max_length=310, allow_unicode=True)
    alternate_name = models.CharField(
        blank=True,
        max_length=100,
        help_text='Alternate name for project, suitable for display as a header',
    )
    alternate_slug = models.SlugField(blank=True, max_length=110, allow_unicode=True)
    description = MarkdownField(blank=True)
    description_rendered = models.TextField(blank=True, editable=False)

    countries = models.ManyToManyField('locations.Country', blank=True)
    regions = models.ManyToManyField(
        'locations.Region', blank=True, help_text='Select or create geographic region names.'
    )
    infrastructure_type = models.ForeignKey(
        InfrastructureType,
        models.SET_NULL,
        blank=True,
        null=True,
        help_text='Select or create named infrastructure types.',
    )
    total_cost = models.BigIntegerField(
        blank=True, null=True, help_text="Values in whole units (dollars, etc.)"
    )
    total_cost_currency = models.CharField(
        blank=True,
        null=True,
        max_length=3,
        choices=CURRENCY_CHOICES,
        default=DEFAULT_CURRENCY_CHOICE,
    )

    start_year = models.PositiveSmallIntegerField(blank=True, null=True)
    start_month = models.PositiveSmallIntegerField(blank=True, null=True)
    start_day = models.PositiveSmallIntegerField(blank=True, null=True)
    commencement_year = models.PositiveSmallIntegerField(
        'Year of commencement of works', blank=True, null=True
    )
    commencement_month = models.PositiveSmallIntegerField(
        'Month of commencement of works', blank=True, null=True
    )
    commencement_day = models.PositiveSmallIntegerField(
        'Day of commencement of works', blank=True, null=True
    )
    planned_completion_year = models.PositiveSmallIntegerField(blank=True,
                                                               null=True)
    planned_completion_month = models.PositiveSmallIntegerField(blank=True,
                                                                null=True)
    planned_completion_day = models.PositiveSmallIntegerField(blank=True,
                                                              null=True)
    linear_length = models.PositiveSmallIntegerField(blank=True, null=True,
                                                     help_text="km")
    new = models.NullBooleanField('New Construction?')
    initiatives = models.ManyToManyField('Initiative', blank=True)
    documents = models.ManyToManyField('ProjectDocument', blank=True)
    sources = ArrayField(
        models.CharField(max_length=1000, validators=[URLLikeValidator]),
        blank=True,
        null=True,
        default=list,
        verbose_name="Sources URLs",
        help_text='Enter URLs separated by commas.',
    )
    notes = MarkdownField(blank=True)

    # Organization relations
    contractors = models.ManyToManyField(
        'facts.Organization',
        verbose_name='Contractors',
        related_name='projects_contracted',
        blank=True,
    )
    manufacturers = models.ManyToManyField(
        'facts.Organization',
        verbose_name='Manufacturers',
        related_name='projects_manufactured',
        blank=True,
    )
    consultants = models.ManyToManyField(
        'facts.Organization',
        verbose_name='Consultants',
        related_name='projects_consulted',
        blank=True,
    )
    implementers = models.ManyToManyField(
        'facts.Organization',
        verbose_name='Client or implementing agency/ies',
        related_name='projects_implemented',
        blank=True,
    )
    operators = models.ManyToManyField(
        'facts.Organization', related_name='projects_operated', blank=True
    )
    # Person relations
    contacts = models.ManyToManyField(
        'facts.Person',
        verbose_name='Points of contact',
        related_name='projects_contacts',
        blank=True,
    )

    # Extras & Internal Use
    extra_data = models.ManyToManyField('facts.Data', blank=True)
    verified_path = models.NullBooleanField(blank=True)
    collection_stage = models.PositiveSmallIntegerField(
        blank=True, null=True, choices=CollectionStage.STAGES,
        default=CollectionStage.IDENTIFIED
    )

    # Geodata
    geo = models.ForeignKey(
        'locations.GeometryStore', models.SET_NULL, blank=True, null=True,
        related_name='projects'
    )
    status = models.PositiveSmallIntegerField(
        blank=True, null=True, choices=ProjectStatus.STATUSES,
        default=ProjectStatus.ANNOUNCED
    )

    # ---- End STANDARD FIELDS ---- #

    # ---- POWER PLANT TYPE PROJECT FIELDS ---- #
    power_plant = models.ForeignKey('PowerPlant', models.CASCADE, blank=True,
                                    null=True)
    fuels = models.ManyToManyField('Fuel', blank=True)

    # These are ostensibly for all projects but they make the most sense
    # for power plants
    project_output = models.FloatField(blank=True, null=True)

    project_output_unit = models.PositiveSmallIntegerField(
        blank=True, null=True, choices=ProjectPlantUnits.UNITS
    )

    project_output_year = models.PositiveSmallIntegerField(blank=True,
                                                           null=True)

    estimated_project_output = models.FloatField(blank=True, null=True)
    estimated_project_output_unit = models.PositiveSmallIntegerField(
        blank=True, null=True, choices=ProjectPlantUnits.UNITS
    )
    project_capacity = models.FloatField(blank=True, null=True)

    project_capacity_unit = models.CharField(blank=True, default='', max_length=20,
                                             choices=ProjectCapacityUnits.UNITS)

    project_capacity_timeframe = models.CharField(blank=True, max_length=10,
                                                  choices=ProjectTimeFrameUnits.TIME_UNITS)

    project_CO2_emissions = models.FloatField(blank=True, null=True)

    project_CO2_emissions_unit = models.PositiveSmallIntegerField(
        blank=True, null=True, choices=ProjectPlantUnits.UNITS
    )

    nox_reduction_system = models.NullBooleanField('NOx Reduction System?')
    sox_reduction_system = models.NullBooleanField('SOx Reduction System?')

    # ---- END POWER PLANT TYPE PROJECT FIELDS ---- #

    # ---- TRANSMISSION TYPE PROJECT FIELDS ---- #
    design_voltage = models.BigIntegerField(null=True, blank=True, help_text="Design Voltage (kV)")
    direct_current = models.NullBooleanField(null=True, blank=True, help_text="Direct Current?")
    electricity_flow = models.CharField(
        null=True,
        blank=True,
        max_length=15,
        choices=(('bidirectional', 'Bidirectional'), ('unidirectional', 'Unidirectional')),
        help_text="Electricity Flow (direction)",
    )
    estimated_transfer_capacity = models.BigIntegerField(
        null=True, blank=True, help_text="Estimated Transfer Capacity (MW)"
    )
    # ---- END TRANSMISSION TYPE PROJECT FIELDS ---- #

    # ---- PIPELINE TYPE PROJECT FIELDS ---- #
    pipeline_diameter = models.IntegerField("Pipeline Diameter", null=True, blank=True)
    pipeline_diameter_unit = models.CharField("Diameter Unit", blank=True, max_length=6,
                                              choices=PipelineDiameters.UNITS,
                                              help_text="Diameter unit")
    pipeline_metered = models.NullBooleanField("Pipeline Metered?", null=True, blank=True)

    pipeline_throughput = models.BigIntegerField("Throughput", null=True, blank=True)
    pipeline_throughput_unit = models.CharField("Throughput Unit", blank=True,
                                                max_length=20,
                                                choices=ProjectThroughputUnits.UNITS)
    pipeline_throughput_timeframe = models.CharField("Throughput Timeframe", blank=True,
                                                     max_length=10,
                                                     choices=ProjectTimeFrameUnits.TIME_UNITS)
    pipeline_throughput_year = models.PositiveSmallIntegerField("Throughput Year", null=True, blank=True)

    # ---- END PIPELINE TYPE PROJECT FIELDS ---- #

    # ---- PROPERTIES ---- #
    @property
    def fuzzy_output_date(self):
        return fuzzydate(self.project_output_year)

    @property
    def fuzzy_start_date(self):
        return fuzzydate(self.start_year,
                         self.start_month,
                         self.start_day)

    @property
    def fuzzy_commencement_date(self):
        return fuzzydate(self.commencement_year,
                         self.commencement_month,
                         self.commencement_day)

    @property
    def fuzzy_planned_completion_date(self):
        return fuzzydate(
            self.planned_completion_year,
            self.planned_completion_month,
            self.planned_completion_day
        )

    @property
    def humanize_capacity(self):
        if self.project_capacity is None:
            return False
        if self.project_capacity >= (10**6):  # Is the capacity GTE to 1 million
            return True
        return False

    @property
    def pipeline_capacity_property(self):
        if self.project_capacity is None:
            return None
        pc = ''
        if self.project_capacity_unit:
            pc += " {}".format(self.get_project_capacity_unit_display().lower())
        if self.project_capacity_timeframe:
            pc += " {}".format(self.get_project_capacity_timeframe_display())
        return pc

    @property
    def pipeline_throughput_property(self):
        if self.pipeline_throughput is None:
            return None
        pt = ''
        if self.pipeline_throughput_unit:
            pt += " {}".format(self.get_pipeline_throughput_unit_display().lower())
        if self.pipeline_throughput_timeframe:
            pt += " {}".format(self.get_pipeline_throughput_timeframe_display())
        if self.pipeline_throughput_year:
            pt += " ({})".format(self.pipeline_throughput_year)
        return pt

    # ---- END PROPERTIES ---- #

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        self.description_rendered = render_markdown(self.description)
        super(Project, self).save(*args, **kwargs)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse(
            'infrastructure:project-detail',
            kwargs={
                'slug': self.alternate_slug or self.slug or 'p',
                'identifier': str(self.identifier),
            },
        )


class Fuel(Publishable):
    name = models.CharField(max_length=140)
    fuel_category = models.ForeignKey(
        'FuelCategory', blank=True, null=True, help_text='Select or create named fuel categories.'
    )

    def __str__(self):
        return self.name


class FuelCategory(Publishable):
    name = models.CharField(max_length=140)

    class Meta:
        verbose_name_plural = 'fuel categories'

    def __str__(self):
        return self.name


class PowerPlant(Publishable):
    """Describes a Power Plant"""

    name = models.CharField(max_length=140)
    slug = models.SlugField(max_length=150, allow_unicode=True)

    description = MarkdownField(blank=True)
    description_rendered = models.TextField(blank=True, editable=False)

    infrastructure_type = models.ForeignKey(
        InfrastructureType,
        models.SET_NULL,
        blank=True,
        null=True,
        help_text='Select or create named insfrastructure types.',
    )
    fuels = models.ManyToManyField('Fuel', blank=True)
    total_cost = models.BigIntegerField(
        blank=True, null=True, help_text="Values in whole units (dollars, etc.)"
    )
    total_cost_currency = models.CharField(
        blank=True, max_length=3, choices=CURRENCY_CHOICES, default=DEFAULT_CURRENCY_CHOICE
    )
    countries = models.ManyToManyField('locations.Country', blank=True)
    regions = models.ManyToManyField(
        'locations.Region', blank=True, help_text='Select or create geographic region names.'
    )
    status = models.PositiveSmallIntegerField(
        blank=True, null=True, choices=PowerPlantStatus.STATUSES
    )
    plant_year_online = models.PositiveSmallIntegerField(blank=True, null=True)
    plant_month_online = models.PositiveSmallIntegerField(blank=True, null=True)
    plant_day_online = models.PositiveSmallIntegerField(blank=True, null=True)

    plant_initiatives = models.ManyToManyField('Initiative', blank=True)

    @property
    def fuzzy_plant_online_date(self):
        return fuzzydate(self.plant_year_online, self.plant_month_online, self.plant_day_online)

    decommissioning_year = models.PositiveSmallIntegerField(blank=True, null=True)
    decommissioning_month = models.PositiveSmallIntegerField(blank=True, null=True)
    decommissioning_day = models.PositiveSmallIntegerField(blank=True, null=True)

    @property
    def fuzzy_decommissioning_date(self):
        return fuzzydate(
            self.decommissioning_year, self.decommissioning_month, self.decommissioning_day
        )

    plant_capacity = models.FloatField(blank=True, null=True)

    plant_capacity_unit = models.PositiveSmallIntegerField(
        blank=True, null=True, choices=ProjectPlantUnits.UNITS
    )

    plant_output = models.FloatField(blank=True, null=True)

    plant_output_unit = models.PositiveSmallIntegerField(
        blank=True, null=True, choices=ProjectPlantUnits.UNITS
    )

    plant_output_year = models.PositiveSmallIntegerField(blank=True, null=True)

    estimated_plant_output = models.FloatField(blank=True, null=True)
    estimated_plant_output_unit = models.PositiveSmallIntegerField(
        blank=True, null=True, choices=ProjectPlantUnits.UNITS
    )

    plant_CO2_emissions = models.FloatField(blank=True, null=True)

    plant_CO2_emissions_unit = models.PositiveSmallIntegerField(
        blank=True, null=True, choices=ProjectPlantUnits.UNITS
    )

    grid_connected = models.NullBooleanField('Grid connected?')
    notes = MarkdownField(blank=True)

    # Geodata
    geo = models.ForeignKey(
        'locations.GeometryStore',
        models.SET_NULL,
        blank=True,
        null=True,
        related_name='power_plants',
    )

    operators = models.ManyToManyField(
        'facts.Organization', verbose_name='Operators', related_name='plants_operated', blank=True
    )

    sources = ArrayField(
        models.CharField(max_length=1000, validators=[URLLikeValidator]),
        blank=True,
        null=True,
        default=list,
        verbose_name="Sources URLs",
        help_text='Enter URLs separated by commas.',
    )

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('infrastructure:powerplant-detail', kwargs={'slug': self.slug})

    def save(self, *args, **kwargs):
        self.description_rendered = render_markdown(self.description)
        return super().save(*args, **kwargs)


class InitiativeType(models.Model):
    """Defines a type of initiative"""

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=110, allow_unicode=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug or self.slug == '':
            self.slug = slugify(self.name, allow_unicode=True)
        super(InitiativeType, self).save(*args, **kwargs)


class Initiative(MPTTModel, Publishable):
    """Describes an initiative"""

    identifier = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(max_length=140)
    slug = models.SlugField(max_length=150, allow_unicode=True)
    initiative_type = models.ForeignKey('InitiativeType', models.SET_NULL, blank=True, null=True)
    notes = MarkdownField(blank=True)
    principal_agent = models.ForeignKey(
        'facts.Organization',
        models.SET_NULL,
        blank=True,
        null=True,
        related_name='principal_initiatives',
    )
    parent = TreeForeignKey(
        'self',
        models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='parent initiative',
        related_name='children',
        db_index=True,
    )
    related_initiatives = models.ManyToManyField('self', blank=True)

    documents = models.ManyToManyField('sources.Document', blank=True)

    founding_year = models.PositiveSmallIntegerField('Founding/Signing Year', blank=True, null=True)
    founding_month = models.PositiveSmallIntegerField(
        'Founding/Signing Month', blank=True, null=True
    )
    founding_day = models.PositiveSmallIntegerField('Founding/Signing Day', blank=True, null=True)

    @property
    def fuzzy_founding_date(self):
        return fuzzydate(self.founding_year, self.founding_month, self.founding_day)

    affiliated_organizations = models.ManyToManyField('facts.Organization', blank=True)
    affiliated_events = models.ManyToManyField('facts.Event', blank=True)
    affiliated_people = models.ManyToManyField('facts.Person', blank=True)
    member_countries = models.ManyToManyField(
        'locations.Country', blank=True, related_name='initiatives_joined'
    )
    geographic_scope = models.ManyToManyField(
        'locations.Country', blank=True, related_name='initiatives_in_scope'
    )

    appeared_year = models.PositiveSmallIntegerField('First Apperance Year', blank=True, null=True)
    appeared_month = models.PositiveSmallIntegerField(
        'First Apperance Month', blank=True, null=True
    )
    appeared_day = models.PositiveSmallIntegerField('First Apperance Day', blank=True, null=True)

    @property
    def fuzzy_appeared_date(self):
        return fuzzydate(self.appeared_year, self.appeared_month, self.appeared_day)

    class Meta:
        ordering = ['name']

    publishable_objects = PublishableQuerySet.as_manager()

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug or self.slug == '':
            self.slug = slugify(self.name, allow_unicode=True)
        super(Initiative, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse(
            'infrastructure:initiative-detail',
            kwargs={'slug': self.slug or 'i', 'identifier': str(self.identifier)},
        )


class ProjectDocument(models.Model):
    DOCUMENT_TYPES = (
        (
            'Public Materials',
            (
                (1, 'Press Releases'),
                (2, 'Presentations & Brochures'),
                (3, 'National Development Plans'),
            ),
        ),
        (
            'Agreements/Contracts',
            (
                (4, 'MoU'),
                (5, 'Financing Agreements'),
                (6, 'Procurement Contracts'),
                (7, 'Other Agreements'),
            ),
        ),
        (
            'Operational Documents',
            (
                (8, 'Concept Notes'),
                (9, 'Review and Approval Documents'),
                (10, 'Procurement Documents'),
                (11, 'Appraisal Documents'),
                (12, 'Administration Manuals'),
                (13, 'Aide-Memoires'),
                (14, 'Financial Audits'),
            ),
        ),
        (
            'Impact Assessment and Monitoring Reports',
            (
                (15, 'Environmental and Social Assessment'),
                (16, 'Resettlement Frameworks'),
                (17, 'Safeguards Monitoring Reports'),
                (18, 'Consultation Minutes'),
            ),
        ),
        ('Implementation Progress Reports', ((19, 'Progress Reports'), (20, 'Completion Reports'))),
        ('Miscellaneous Reports', ((21, 'Miscellaneous Reports'),)),
        ('Unofficial Sources', ((22, 'Unofficial Sources'),)),
    )

    identifier = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    document = models.ForeignKey('sources.Document', models.SET_NULL, blank=True, null=True)
    source_url = models.CharField(blank=True, max_length=1000, validators=[URLLikeValidator])
    document_type = models.PositiveSmallIntegerField(
        'type', choices=DOCUMENT_TYPES, blank=True, null=True
    )
    notes = MarkdownField(blank=True)
    status_indicator = models.PositiveSmallIntegerField(
        blank=True, null=True, choices=ProjectStatus.STATUSES
    )

    class Meta:
        ordering = ['document_type', 'source_url']

    def __str__(self):
        if self.source_url:
            return self.source_url
        return "Document #{}".format(self.id)

    def get_source_url_tail(self):
        return self.source_url.split('/')[-1] or None


class CuratedProjectCollection(Publishable):
    """A collection of projects for the megamap"""

    name = models.CharField(max_length=256)
    projects = models.ManyToManyField('Project', blank=False)

    def __str__(self):
        return self.name


class ProjectSubstation(models.Model):
    """information about a substation related to a transmission line project."""

    name = models.CharField(max_length=1024, blank=True, help_text="Substation Name (Location)")
    project = models.ForeignKey('Project', on_delete=models.CASCADE, help_text="Substation Project")
    capacity = models.BigIntegerField(blank=True, null=True, help_text="Substation Capacity (MW)")
    voltage = models.BigIntegerField(blank=True, null=True, help_text="Substation Voltage (kV)")

    def __str__(self):
        return "{} ({})".format(self.name, self.project)
