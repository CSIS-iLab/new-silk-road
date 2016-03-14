from django.db import models
from django.contrib.postgres.fields import ArrayField
from publish.models import Publishable
from mptt.models import MPTTModel, TreeForeignKey
from locations.models import CountryField
from markymark.fields import MarkdownField


class InfrastructureType(models.Model):
    """Type of infrastructure"""
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


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

    name = models.CharField("Project name/title", max_length=100)
    countries = ArrayField(
        CountryField(),
        blank=True,
        null=True,
        default=list
    )
    regions = models.ManyToManyField('locations.Region', blank=True, help_text='Select or create geographic region names.')
    infrastructure_type = models.ForeignKey(InfrastructureType,
                                            models.SET_NULL, blank=True, null=True,
                                            help_text='Select or create named infrastructure types.')
    funding_sources = models.ManyToManyField('facts.Organization', related_name='funded_projects', blank=True)
    client = models.ManyToManyField('facts.Organization', help_text='Client or implementing agency', blank=True)
    status = models.PositiveSmallIntegerField(
        blank=True, null=True,
        choices=ProjectStatus.STATUSES, default=ProjectStatus.ANNOUNCED
    )
    initiative = models.ForeignKey('Initiative', models.SET_NULL, blank=True, null=True)
    documents = models.ManyToManyField('ProjectDocument', blank=True)

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
    document = models.ForeignKey('sources.Document')
    notes = MarkdownField(blank=True)
    status_indicator = models.PositiveSmallIntegerField(
        blank=True, null=True,
        choices=ProjectStatus.STATUSES
    )
