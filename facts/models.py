from django.db import models
from django.contrib.postgres.fields import ArrayField
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

    # Biographical Info
    citizenships = ArrayField(
        models.PositiveSmallIntegerField(choices=COUNTRY_CHOICES, blank=True),
        blank=True,
        default=list
    )
    birth_date = models.DateField(blank=True, null=True)
    biography = models.TextField(blank=True)

    # Relations
    events = models.ManyToManyField('Event', blank=True)

    class Meta:
        verbose_name_plural = 'People'

    def __str__(self):
        name_parts = (self.given_name, self.family_name)
        if self.name_order is self.FAMILY_FIRST_ORDER:
            name_parts = reversed(name_parts)
        return " ".join(name_parts)

    def citizenships_names(self):
        return ", ".join((countries.get(s).name for s in self.citizenships))
    citizenships_names.short_description = 'Citizenships'


class Organization(models.Model):
    """Describes an organization"""
    name = models.CharField(max_length=200)
    parent = models.ForeignKey('self', related_name='children', null=True, blank=True)
    founding_date = models.DateField(blank=True, null=True)
    dissolution_date = models.DateField(blank=True, null=True)
    events = models.ManyToManyField('Event', blank=True)

    def __str__(self):
        return self.name


class Place(models.Model):
    """Describes a place"""
    name = models.CharField(blank=True, max_length=100)
    lon = models.FloatField(blank=True, null=True, help_text="Defines a geographic longitude")
    lat = models.FloatField(blank=True, null=True, help_text="Defines a geographic latitude")
    country = models.PositiveSmallIntegerField(choices=COUNTRY_CHOICES, blank=True, null=True)
    events = models.ManyToManyField('Event', blank=True)

    def __str__(self):
        return self.name


class Event(models.Model):
    """(Event description)"""
    name = models.CharField(blank=True, max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name
