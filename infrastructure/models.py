from django.db import models
from django.contrib.postgres.fields import ArrayField
from publish.models import Publishable
from mptt.models import MPTTModel, TreeForeignKey
from locations.models import CountryField
from markymark.fields import MarkdownField
from finance.currency import CURRENCY_CHOICES, DEFAULT_CURRENCY_CHOICE


class InfrastructureType(models.Model):
    """Type of infrastructure"""
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class ProjectFunding(models.Model):
    """(ProjectFunder description)"""
    source = models.ForeignKey('facts.Organization')
    project = models.ForeignKey('Project')
    amount = models.IntegerField(
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

    def __str__(self):
        return "{}: {} {}".format(
            self.source.name, self.amount or None, self.currency
        )


class ProjectStatus:
    ANNOUNCED = 1
    PREPATORY = 2
    STARTED = 3
    UNDER_CONSTRUCTION = 4
    COMPLETED = 5

    STATUSES = (
        (ANNOUNCED, 'Announced/Under Negotiation'),
        (PREPATORY, 'Preparatory Works'),
        (STARTED, 'Started'),
        (UNDER_CONSTRUCTION, 'Under Construction'),
        (COMPLETED, 'Completed')
    )


class Project(Publishable):
    """Describes a project"""
    name = models.CharField("Project name/title", max_length=200)
    countries = ArrayField(
        CountryField(),
        blank=True,
        null=True,
        default=list
    )
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
    total_cost_description = models.CharField(
        'Total Project Cost',
        blank=True, max_length=100
    )
    start_date = models.DateField(blank=True, null=True)
    commencement_date = models.DateField(
        'Date of commencement of works',
        blank=True, null=True
    )
    planned_completion_date = models.DateField(
        'Planned completion date',
        blank=True, null=True
    )
    status = models.PositiveSmallIntegerField(
        blank=True, null=True,
        choices=ProjectStatus.STATUSES, default=ProjectStatus.ANNOUNCED
    )
    initiative = models.ForeignKey('Initiative', models.SET_NULL, blank=True, null=True)
    documents = models.ManyToManyField('ProjectDocument', blank=True)
    sources = ArrayField(
        models.URLField(max_length=500),
        blank=True,
        null=True,
        default=list,
        verbose_name="Sources URLs",
        help_text='Enter URLs separated by commas.'
    )
    notes = MarkdownField(blank=True)
    # Organization relations
    funding = models.ManyToManyField(
        'facts.Organization',
        through='ProjectFunding',
        related_name='projects_funded',
        blank=True
    )
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
    operator = models.ForeignKey(
        'facts.Organization',
        models.SET_NULL,
        related_name='projects_operated',
        blank=True,
        null=True
    )
    # Person relations
    contacts = models.ManyToManyField(
        'facts.Person',
        verbose_name='Points of contact',
        related_name='projects_contacts',
        blank=True
    )

    def __str__(self):
        return self.name


class InitiativeType(models.Model):
    """Defines a type of initiative"""
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Initiative(MPTTModel, Publishable):
    """Describes an initiative"""

    name = models.CharField(max_length=140)
    initiative_type = models.ForeignKey('InitiativeType', models.SET_NULL, blank=True, null=True)
    notes = MarkdownField(blank=True)
    principal_agent = models.ForeignKey(
        'facts.Person', models.SET_NULL, blank=True, null=True,
        related_name='principal_initiatives',
    )
    parent = TreeForeignKey('self', null=True, blank=True,
                            verbose_name='parent initiative',
                            related_name='children', db_index=True)
    founding_date = models.DateField('Founding/Signing Date', blank=True, null=True)
    affiliated_organizations = models.ManyToManyField('facts.Organization', blank=True)
    affiliated_events = models.ManyToManyField('facts.Event', blank=True)
    affiliated_people = models.ManyToManyField('facts.Person', blank=True)
    member_countries = ArrayField(
        CountryField(),
        blank=True,
        null=True,
        default=list
    )
    geographic_scope = models.ForeignKey('locations.Region',
                                         on_delete=models.SET_NULL,
                                         blank=True, null=True)

    def __str__(self):
        return self.name


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

    document = models.ForeignKey(
        'sources.Document',
        models.SET_NULL,
        blank=True,
        null=True
    )
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
