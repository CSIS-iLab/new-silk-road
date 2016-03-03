from django.db import models
from django.contrib.postgres.fields import ArrayField
from publish.models import Publishable
from locations.models import CountryField
from markymark.fields import MarkdownField


class InfrastructureType(models.Model):
    """Type of infrastructure"""
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Project(Publishable):
    """Describes a project"""

    STATUS_ANNOUNCED = 1
    STATUS_PREPATORY = 2
    STATUS_STARTED = 3
    STATUS_UNDER_CONSTRUCTION = 4
    STATUS_COMPLETED = 5

    PROJECT_STATUSES = (
        (STATUS_ANNOUNCED, 'Announced/Under Negotiation'),
        (STATUS_PREPATORY, 'Preparatory Works'),
        (STATUS_STARTED, 'Started'),
        (STATUS_UNDER_CONSTRUCTION, 'Under Construction'),
        (STATUS_COMPLETED, 'Completed')
    )

    title = models.CharField(max_length=100)
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
    funding_sources = models.ManyToManyField('Organization', related_name='funded_projects', blank=True)
    client = models.ManyToManyField('Organization', help_text='Client or implementing agency', blank=True)
    status = models.PositiveSmallIntegerField(blank=True, null=True,
                                              choices=PROJECT_STATUSES, default=STATUS_ANNOUNCED)
    initiative = models.ForeignKey('Initiative', models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return self.title


class InitiativeType(models.Model):
    """Defines a type of initiative"""
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Initiative(Publishable):
    """Describes an initiative"""

    name = models.CharField(max_length=140)
    initiative_type = models.ForeignKey('InitiativeType', models.SET_NULL, blank=True, null=True)
    notes = MarkdownField(blank=True)
    principal_agent = models.ForeignKey('Person', models.SET_NULL, blank=True, null=True)
    parent_initiative = models.ForeignKey('self',
                                          models.SET_NULL, blank=True, null=True,
                                          related_name="sub_initiatives")
    founding_date = models.DateField('Founding/Signing Date', blank=True, null=True)
    affiliated_organizations = models.ManyToManyField('Organization', blank=True)
    affiliated_events = models.ManyToManyField('Event', blank=True)
    # TODO: Figure out countries (members vs geographic scope)
    # member_countries = ???
    # geographic_scope = ???

    def __str__(self):
        return self.name


class ProjectDocuments(models.Model):
    pass
    # Need structure for project's documents
