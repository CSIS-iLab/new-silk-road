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

    class Meta:
        ordering = ['name', ]

    def __str__(self):
        return self.name


class OwnerStake(models.Model):
    """ Percentage that owners own and also relation with PowerPlant and Organization """
    power_plant = models.ForeignKey(
        'PowerPlant',
        models.CASCADE,
        related_name='owner_stakes'
    )
    owner = models.ForeignKey(
        'facts.Organization',
        models.CASCADE,
        related_name='owners_stakes'
    )
    percent_owned = models.FloatField(blank=True, null=True)

    def __str__(self):
        return "{} stake in {}".format(self.owner, self.power_plant)


class ProjectFunding(Temporal):
    """ProjectFunding relates Organizations to projects they fund, with amounts"""
    sources = models.ManyToManyField('facts.Organization', blank=True)
    project = models.ForeignKey('Project', models.CASCADE, related_name='funding')
    amount = models.BigIntegerField(
        blank=True, null=True,
        help_text="Values in whole units (dollars, etc.)"
    )
    currency = models.CharField(
        blank=True, null=True,
        max_length=3,
        choices=CURRENCY_CHOICES,
        default=DEFAULT_CURRENCY_CHOICE
    )

    class Meta:
        verbose_name_plural = 'project funders'
        ordering = ['project__name', 'created_at']

    def __str__(self):
        return "{} {}".format(
            self.amount or None, self.currency
        )


class PowerPlantStatus:
    ACTIVE = 1
    PARTIALLY_ACTIVE = 2
    INACTIVE = 3

    STATUSES = (
        (ACTIVE, 'Active'),
        (PARTIALLY_ACTIVE, 'Partially Active'),
        (INACTIVE, 'Inactive')
    )


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
        (SUSPENDED, 'Suspended')
    )


class ProjectPlantUnits:
    MEGAWATTHOUR = 0
    MEGAWATT = 1
    TONNESPERANNUM = 2

    UNITS = (
        (MEGAWATTHOUR, 'MWh'),
        (MEGAWATT, 'MW'),
        (TONNESPERANNUM, 'Tonnes per annum')
    )


class CollectionStage(object):
    IDENTIFIED = 1
    COLLECTED = 2
    STAGES = (
        (IDENTIFIED, 'Identified'),
        (COLLECTED, 'Collected'),
    )


class Project(Publishable):
    """Describes a project"""
    identifier = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField("Project name/title", max_length=300)
    slug = models.SlugField(max_length=310, allow_unicode=True)
    alternate_name = models.CharField(
        blank=True,
        max_length=100,
        help_text='Alternate name for project, suitable for display as a header'
    )
    alternate_slug = models.SlugField(
        blank=True,
        max_length=110,
        allow_unicode=True
    )
    description = MarkdownField(blank=True)
    description_rendered = models.TextField(blank=True, editable=False)

    countries = models.ManyToManyField('locations.Country', blank=True)
    regions = models.ManyToManyField(
        'locations.Region',
        blank=True,
        help_text='Select or create geographic region names.'
    )
    infrastructure_type = models.ForeignKey(
        InfrastructureType,
        models.SET_NULL, blank=True, null=True,
        help_text='Select or create named infrastructure types.'
    )
    power_plant = models.ForeignKey('PowerPlant', models.CASCADE, blank=True, null=True)
    fuels = models.ManyToManyField(
        'Fuel',
        blank=True,
    )
    total_cost = models.BigIntegerField(
        blank=True, null=True,
        help_text="Values in whole units (dollars, etc.)"
    )
    total_cost_currency = models.CharField(
        blank=True, null=True,
        max_length=3,
        choices=CURRENCY_CHOICES,
        default=DEFAULT_CURRENCY_CHOICE
    )

    start_year = models.PositiveSmallIntegerField(blank=True, null=True)
    start_month = models.PositiveSmallIntegerField(blank=True, null=True)
    start_day = models.PositiveSmallIntegerField(blank=True, null=True)

    @property
    def fuzzy_start_date(self):
        return fuzzydate(self.start_year, self.start_month, self.start_day)

    commencement_year = models.PositiveSmallIntegerField(
        'Year of commencement of works',
        blank=True,
        null=True
    )
    commencement_month = models.PositiveSmallIntegerField(
        'Month of commencement of works',
        blank=True,
        null=True
    )
    commencement_day = models.PositiveSmallIntegerField(
        'Day of commencement of works',
        blank=True,
        null=True
    )

    @property
    def fuzzy_commencement_date(self):
        return fuzzydate(self.commencement_year, self.commencement_month, self.commencement_day)

    planned_completion_year = models.PositiveSmallIntegerField(blank=True, null=True)
    planned_completion_month = models.PositiveSmallIntegerField(blank=True, null=True)
    planned_completion_day = models.PositiveSmallIntegerField(blank=True, null=True)

    @property
    def fuzzy_planned_completion_date(self):
        return fuzzydate(
            self.planned_completion_year,
            self.planned_completion_month,
            self.planned_completion_day
        )

    construction_start_year = models.PositiveSmallIntegerField(blank=True, null=True)
    construction_start_month = models.PositiveSmallIntegerField(blank=True, null=True)
    construction_start_day = models.PositiveSmallIntegerField(blank=True, null=True)

    @property
    def fuzzy_construction_date(self):
        return fuzzydate(
            self.construction_start_year,
            self.construction_start_month,
            self.construction_start_day
        )

    project_output = models.FloatField(
        blank=True, null=True,
    )

    project_output_unit = models.PositiveSmallIntegerField(
        blank=True, null=True,
        choices=ProjectPlantUnits.UNITS
    )

    project_output_year = models.PositiveSmallIntegerField(blank=True, null=True)

    @property
    def fuzzy_output_date(self):
        return fuzzydate(self.project_output_year)

    estimated_project_output = models.FloatField(
        blank=True, null=True,
    )
    estimated_project_output_unit = models.PositiveSmallIntegerField(
        blank=True, null=True,
        choices=ProjectPlantUnits.UNITS
    )
    project_capacity = models.FloatField(
        blank=True, null=True,
        help_text="MW"
    )

    project_capacity_unit = models.PositiveSmallIntegerField(
        blank=True, null=True,
        choices=ProjectPlantUnits.UNITS
    )

    project_CO2_emissions = models.FloatField(
        blank=True, null=True,
    )

    project_CO2_emissions_unit = models.PositiveSmallIntegerField(
        blank=True, null=True,
        choices=ProjectPlantUnits.UNITS
    )

    nox_reduction_system = models.NullBooleanField('NOx Reduction System?')
    sox_reduction_system = models.NullBooleanField('SOx Reduction System?')

    status = models.PositiveSmallIntegerField(
        blank=True, null=True,
        choices=ProjectStatus.STATUSES, default=ProjectStatus.ANNOUNCED
    )
    new = models.NullBooleanField('New Construction?')
    initiatives = models.ManyToManyField('Initiative', blank=True)
    documents = models.ManyToManyField('ProjectDocument', blank=True)
    sources = ArrayField(
        models.CharField(max_length=1000, validators=[URLLikeValidator]),
        blank=True,
        null=True,
        default=list,
        verbose_name="Sources URLs",
        help_text='Enter URLs separated by commas.'
    )
    notes = MarkdownField(blank=True)

    # Organization relations
    contractors = models.ManyToManyField(
        'facts.Organization',
        verbose_name='Contractors',
        related_name='projects_contracted',
        blank=True
    )
    manufacturers = models.ManyToManyField(
        'facts.Organization',
        verbose_name='Manufacturers',
        related_name='projects_manufactured',
        blank=True
    )
    consultants = models.ManyToManyField(
        'facts.Organization',
        verbose_name='Consultants',
        related_name='projects_consulted',
        blank=True
    )
    implementers = models.ManyToManyField(
        'facts.Organization',
        verbose_name='Client or implementing agency/ies',
        related_name='projects_implemented',
        blank=True
    )
    operators = models.ManyToManyField(
        'facts.Organization',
        related_name='projects_operated',
        blank=True,
    )
    # Person relations
    contacts = models.ManyToManyField(
        'facts.Person',
        verbose_name='Points of contact',
        related_name='projects_contacts',
        blank=True
    )

    # Extras & Internal Use
    extra_data = models.ManyToManyField('facts.Data', blank=True)
    verified_path = models.NullBooleanField(blank=True)
    collection_stage = models.PositiveSmallIntegerField(
        blank=True, null=True,
        choices=CollectionStage.STAGES,
        default=CollectionStage.IDENTIFIED
    )

    # Geodata
    geo = models.ForeignKey(
        'locations.GeometryStore',
        models.SET_NULL,
        blank=True, null=True,
        related_name='projects'
    )

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
                'identifier': str(self.identifier)
            }
        )


class Fuel(Publishable):
    name = models.CharField(max_length=140)
    fuel_category = models.ForeignKey(
        'FuelCategory',
        blank=True, null=True,
        help_text='Select or create named fuel categories.'
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
    infrastructure_type = models.ForeignKey(
        InfrastructureType,
        models.SET_NULL, blank=True, null=True,
        help_text='Select or create named insfrastructure types.'
    )
    fuels = models.ManyToManyField(
        'Fuel',
        blank=True,
    )
    countries = models.ManyToManyField('locations.Country', blank=True)
    regions = models.ManyToManyField(
        'locations.Region',
        blank=True,
        help_text='Select or create geographic region names.'
    )
    status = models.PositiveSmallIntegerField(
        blank=True, null=True,
        choices=PowerPlantStatus.STATUSES
    )
    plant_year_online = models.PositiveSmallIntegerField(blank=True, null=True)
    plant_month_online = models.PositiveSmallIntegerField(blank=True, null=True)
    plant_day_online = models.PositiveSmallIntegerField(blank=True, null=True)

    @property
    def fuzzy_plant_online_date(self):
        return fuzzydate(self.plant_year_online, self.plant_month_online, self.plant_day_online)

    decommissioning_year = models.PositiveSmallIntegerField(blank=True, null=True)
    decommissioning_month = models.PositiveSmallIntegerField(blank=True, null=True)
    decommissioning_day = models.PositiveSmallIntegerField(blank=True, null=True)

    @property
    def fuzzy_decommissioning_date(self):
        return fuzzydate(
            self.decommissioning_year,
            self.decommissioning_month,
            self.decommissioning_day
        )

    plant_capacity = models.FloatField(
        blank=True, null=True,
    )

    plant_capacity_unit = models.PositiveSmallIntegerField(
        blank=True, null=True,
        choices=ProjectPlantUnits.UNITS
    )

    plant_output = models.FloatField(
        blank=True, null=True,
    )

    plant_output_unit = models.PositiveSmallIntegerField(
        blank=True, null=True,
        choices=ProjectPlantUnits.UNITS
    )

    plant_output_year = models.PositiveSmallIntegerField(blank=True, null=True)

    estimated_plant_output = models.FloatField(
        blank=True, null=True
    )
    estimated_plant_output_unit = models.PositiveSmallIntegerField(
        blank=True, null=True,
        choices=ProjectPlantUnits.UNITS
    )

    plant_CO2_emissions = models.FloatField(
        blank=True, null=True
    )

    plant_CO2_emissions_unit = models.PositiveSmallIntegerField(
        blank=True, null=True,
        choices=ProjectPlantUnits.UNITS
    )

    grid_connected = models.NullBooleanField('Grid connected?')

    latitude = models.DecimalField(
        max_digits=9, decimal_places=6,
        blank=True, null=True
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6,
        blank=True, null=True
    )

    # Organization relations
    owners = models.ManyToManyField(
        'facts.Organization',
        verbose_name='Owners',
        related_name='plants_contracted',
        blank=True
    )
    operators = models.ManyToManyField(
        'facts.Organization',
        verbose_name='Operators',
        related_name='plants_operated',
        blank=True,
    )

    class Meta:
        ordering = ['name', ]

    def __str__(self):
        return self.name


class InitiativeType(models.Model):
    """Defines a type of initiative"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=110, allow_unicode=True)

    class Meta:
        ordering = ['name', ]

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
        'facts.Organization', models.SET_NULL, blank=True, null=True,
        related_name='principal_initiatives',
    )
    parent = TreeForeignKey('self', models.SET_NULL,
                            null=True, blank=True,
                            verbose_name='parent initiative',
                            related_name='children', db_index=True)
    related_initiatives = models.ManyToManyField('self', blank=True)

    documents = models.ManyToManyField('sources.Document', blank=True)

    founding_year = models.PositiveSmallIntegerField(
        'Founding/Signing Year',
        blank=True,
        null=True
    )
    founding_month = models.PositiveSmallIntegerField(
        'Founding/Signing Month',
        blank=True,
        null=True
    )
    founding_day = models.PositiveSmallIntegerField(
        'Founding/Signing Day',
        blank=True,
        null=True
    )

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
    appeared_month = models.PositiveSmallIntegerField('First Apperance Month', blank=True, null=True)
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
            kwargs={
                'slug': self.slug or 'i',
                'identifier': str(self.identifier)
            }
        )


class ProjectDocument(models.Model):
    DOCUMENT_TYPES = (
        ('Public Materials', (
            (1, 'Press Releases'),
            (2, 'Presentations & Brochures'),
            (3, 'National Development Plans'),
        )),
        ('Agreements/Contracts', (
            (4, 'MoU'),
            (5, 'Financing Agreements'),
            (6, 'Procurement Contracts'),
            (7, 'Other Agreements'),
        )),
        ('Operational Documents', (
            (8, 'Concept Notes'),
            (9, 'Review and Approval Documents'),
            (10, 'Procurement Documents'),
            (11, 'Appraisal Documents'),
            (12, 'Administration Manuals'),
            (13, 'Aide-Memoires'),
            (14, 'Financial Audits'),
        )),
        ('Impact Assessment and Monitoring Reports', (
            (15, 'Environmental and Social Assessment'),
            (16, 'Resettlement Frameworks'),
            (17, 'Safeguards Monitoring Reports'),
            (18, 'Consultation Minutes'),
        )),
        ('Implementation Progress Reports', (
            (19, 'Progress Reports'),
            (20, 'Completion Reports'),
        )),
        ('Miscellaneous Reports', (
            (21, 'Miscellaneous Reports'),
        )),
        ('Unofficial Sources', (
            (22, 'Unofficial Sources'),
        )),
    )

    identifier = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    document = models.ForeignKey(
        'sources.Document',
        models.SET_NULL,
        blank=True,
        null=True
    )
    source_url = models.CharField(blank=True, max_length=1000, validators=[URLLikeValidator])
    document_type = models.PositiveSmallIntegerField(
        'type',
        choices=DOCUMENT_TYPES,
        blank=True, null=True
    )
    notes = MarkdownField(blank=True)
    status_indicator = models.PositiveSmallIntegerField(
        blank=True, null=True,
        choices=ProjectStatus.STATUSES
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

