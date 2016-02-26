from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.template.defaultfilters import truncatewords
from taggit.managers import TaggableManager
from iso3166 import countries

COUNTRY_CHOICES = tuple((int(c.numeric), c.name) for c in countries)


class Person(models.Model):
    """Describes a person"""
    GIVEN_FIRST_ORDER = 1
    FAMILY_FIRST_ORDER = 3

    NAME_ORDER_CHOICES = (
        (GIVEN_FIRST_ORDER, 'Given name then family name'),
        (FAMILY_FIRST_ORDER, 'Family name then given name'),
    )

    # Name info
    given_name = models.CharField(max_length=100, help_text="A person's given or 'first' name(s).")
    additional_name = models.CharField(blank=True, max_length=100, help_text="An additional name for a person, \
                                                                              such as a 'middle' name.")
    patronymic_name = models.CharField(blank=True, max_length=100, help_text="A patronymic name, if one exists.")
    family_name = models.CharField(blank=True, max_length=140, help_text="A person's family or 'last' name(s).")
    name_order = models.IntegerField(choices=NAME_ORDER_CHOICES, default=GIVEN_FIRST_ORDER)
    honorific_prefix = models.CharField(blank=True, max_length=100)
    honorific_suffix = models.CharField(blank=True, max_length=100)

    party = models.CharField(blank=True, max_length=100, help_text="Political part affiliation.")

    # Biographical Info
    citizenships = ArrayField(
        models.PositiveSmallIntegerField(choices=COUNTRY_CHOICES, blank=True, null=True),
        blank=True,
        null=True,
        default=list
    )
    birth_date = models.DateField(blank=True, null=True)
    biography = models.TextField(blank=True)

    # Relations
    events = models.ManyToManyField('Event', blank=True)

    tags = TaggableManager(blank=True)

    class Meta:
        verbose_name_plural = 'People'

    def __str__(self):
        name_parts = (self.given_name, self.family_name)
        if self.name_order is self.FAMILY_FIRST_ORDER:
            name_parts = reversed(name_parts)
        return " ".join(name_parts)

    def citizenships_names(self):
        return ", ".join((countries.get(s).name for s in self.citizenships)) if self.citizenships else None
    citizenships_names.short_description = 'Citizenships'


class Organization(models.Model):
    """Describes an organization"""
    name = models.CharField(max_length=200)
    parent = models.ForeignKey('self', related_name='children', null=True, blank=True)
    founding_date = models.DateField(blank=True, null=True)
    dissolution_date = models.DateField(blank=True, null=True)
    events = models.ManyToManyField('Event', blank=True)
    affiliates = models.ManyToManyField('Person', through='Affiliation',
                                        help_text="People who are associated with this organization.")
    headquarters = models.ManyToManyField('Place', blank=True)

    tags = TaggableManager(blank=True)

    def __str__(self):
        return self.name


class Affiliation(models.Model):
    """Describes a relationship between a person and an organization"""
    person = models.ForeignKey('Person')
    organization = models.ForeignKey('Organization')
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True, help_text="Describe how the person is affiliated with the organization")

    def __str__(self):
        return "{}, affiliated with {}".format(self.person, self.organization)


class Place(models.Model):
    """Describes a place"""
    name = models.CharField(blank=True, max_length=100)
    lon = models.FloatField(blank=True, null=True, help_text="Defines a geographic longitude")
    lat = models.FloatField(blank=True, null=True, help_text="Defines a geographic latitude")
    country = models.PositiveSmallIntegerField(choices=COUNTRY_CHOICES, blank=True, null=True)
    events = models.ManyToManyField('Event', blank=True)

    tags = TaggableManager(blank=True)

    def __str__(self):
        return self.name


class Event(models.Model):
    """Describes an event, one which may have a start and end date"""
    name = models.CharField(blank=True, max_length=100)
    description = models.TextField(blank=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)

    tags = TaggableManager(blank=True)

    def __str__(self):
        return self.name


class Insight(models.Model):
    """An insight can involve people, places, and/or organizations"""
    description = models.TextField(blank=True)
    people = models.ManyToManyField('Person', blank=True)
    places = models.ManyToManyField('Place', blank=True)
    organizations = models.ManyToManyField('Organization', blank=True)
    events = models.ManyToManyField('Event', blank=True)

    tags = TaggableManager(blank=True)

    def __str__(self):
        return truncatewords(self.description, 5)


class Region(models.Model):
    """A human-described geograhic region"""
    name = models.CharField(blank=True, max_length=100)

    def __str__(self):
        return self.name


class InfrastructureType(models.Model):
    """Type of infrastructure"""
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Project(models.Model):
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
        models.PositiveSmallIntegerField(choices=COUNTRY_CHOICES, blank=True, null=True),
        blank=True,
        null=True,
        default=list
    )
    regions = models.ManyToManyField('Region', blank=True, help_text='Select or create geographic region names.')
    infrastructure_type = models.ForeignKey(InfrastructureType, blank=True, null=True, help_text='Select or create named infrastructure types.')
    funding_sources = models.ManyToManyField('Organization', related_name='funded_projects', blank=True)
    client = models.ManyToManyField('Organization', help_text='Client or implementing agency', blank=True)
    status = models.PositiveSmallIntegerField(blank=True, null=True,
                                              choices=PROJECT_STATUSES, default=STATUS_ANNOUNCED)
    initiative = models.ForeignKey('Initiative', blank=True, null=True)

    def __str__(self):
        return self.title


class IntiativeType(models.Model):
    """Defines a type of initiative"""
    name = models.CharField(max_length=100)

    def __str__(self):
        return u"IntiativeType"


class Initiative(models.Model):
    """Describes an initiative"""

    name = models.CharField(max_length=140)
    initiative_type = models.ForeignKey('IntiativeType')
    notes = models.TextField(blank=True)

    def __str__(self):
        self.name
