from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.urlresolvers import reverse
from django.utils.text import slugify
from publish.models import Publishable, Temporal
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

    def __str__(self):
        return self.name


class ProjectFunding(Temporal):
    """ProjectFunding relates Organizations to projects they fund, with amounts"""
    sources = models.ManyToManyField('facts.Organization', blank=True)
    project = models.ForeignKey('Project', related_name='funding')
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


class ProjectStatus:
    ANNOUNCED = 1
    PREPATORY = 2
    STARTED = 3
    UNDER_CONSTRUCTION = 4
    COMPLETED = 5
    CANCELLED = 6

    STATUSES = (
        (ANNOUNCED, 'Announced/Under Negotiation'),
        (PREPATORY, 'Preparatory Works'),
        (STARTED, 'Started'),
        (UNDER_CONSTRUCTION, 'Under Construction'),
        (COMPLETED, 'Completed'),
        (CANCELLED, 'Cancelled'),
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

    commencement_year = models.PositiveSmallIntegerField('Year of commencement of works', blank=True, null=True)
    commencement_month = models.PositiveSmallIntegerField('Month of commencement of works', blank=True, null=True)
    commencement_day = models.PositiveSmallIntegerField('Day of commencement of works', blank=True, null=True)

    @property
    def fuzzy_commencement_date(self):
        return fuzzydate(self.commencement_year, self.commencement_month, self.commencement_day)

    planned_completion_year = models.PositiveSmallIntegerField(blank=True, null=True)
    planned_completion_month = models.PositiveSmallIntegerField(blank=True, null=True)
    planned_completion_day = models.PositiveSmallIntegerField(blank=True, null=True)

    @property
    def fuzzy_planned_completion_date(self):
        return fuzzydate(self.planned_completion_year, self.planned_completion_month, self.planned_completion_day)

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
                'slug': self.alternate_slug or self.slug,
                'identifier': str(self.identifier)
            }
        )


class InitiativeType(models.Model):
    """Defines a type of initiative"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=110, allow_unicode=True)

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
    parent = TreeForeignKey('self', null=True, blank=True,
                            verbose_name='parent initiative',
                            related_name='children', db_index=True)

    founding_year = models.PositiveSmallIntegerField('Founding/Signing Year', blank=True, null=True)
    founding_month = models.PositiveSmallIntegerField('Founding/Signing Month', blank=True, null=True)
    founding_day = models.PositiveSmallIntegerField('Founding/Signing Day', blank=True, null=True)

    affiliated_organizations = models.ManyToManyField('facts.Organization', blank=True)
    affiliated_events = models.ManyToManyField('facts.Event', blank=True)
    affiliated_people = models.ManyToManyField('facts.Person', blank=True)
    member_countries = models.ManyToManyField('locations.Country', blank=True)
    geographic_scope = models.ForeignKey('locations.Region',
                                         on_delete=models.SET_NULL,
                                         blank=True, null=True)

    appeared_year = models.PositiveSmallIntegerField('First Apperance Year', blank=True, null=True)
    appeared_month = models.PositiveSmallIntegerField('First Apperance Month', blank=True, null=True)
    appeared_day = models.PositiveSmallIntegerField('First Apperance Day', blank=True, null=True)

    class Meta:
        ordering = ['name']

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
                'slug': self.slug,
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
        ))
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

    @classmethod
    def _flattened_doc_types(cls):
        return (value for _, subset in cls.DOCUMENT_TYPES for value in subset)

    @classmethod
    def get_document_type_names(cls):
        return tuple(name for _, name in cls._flattened_doc_types())

    @classmethod
    def lookup_document_type_by_name(cls, name):
        if name:
            filtered = filter(lambda x: x[1].lower() == name.lower(), cls._flattened_doc_types())
            as_list = list(filtered)
            if len(as_list) == 1:
                return as_list[0]
        return None
