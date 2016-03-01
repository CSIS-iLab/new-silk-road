from django.db import models
from django.contrib.postgres.fields import ArrayField
from .locations import COUNTRY_CHOICES, countries
from markymark.fields import MarkdownField
from publish.models import Publishable


class Person(Publishable):
    """Describes a person"""
    # Name info
    given_name = models.CharField('First name', max_length=100, help_text="A person's given or 'first' name(s).")
    additional_name = models.CharField('Middle name', blank=True, max_length=100, help_text="An additional name for a person, \
                                                                              such as a 'middle' name.")
    family_name = models.CharField('Last name', blank=True, max_length=140, help_text="A person's family or 'last' name(s).")

    # Biographical Info
    citizenships = ArrayField(
        models.PositiveSmallIntegerField(choices=COUNTRY_CHOICES),
        blank=True,
        null=True,
        default=list
    )
    birth_date = models.DateField(blank=True, null=True)

    # Notes
    notes = MarkdownField(blank=True)

    # Relations
    events = models.ManyToManyField('Event', blank=True)
    initiatives = models.ManyToManyField('Initiative', blank=True)

    class Meta:
        verbose_name_plural = 'People'

    def __str__(self):
        return " ".join((self.given_name, self.family_name))

    def citizenships_names(self):
        return ", ".join((countries.get(s).name for s in self.citizenships)) if self.citizenships else None
    citizenships_names.short_description = 'Citizenships'


class Position(models.Model):
    """Describes a position a person holds/held at an organization"""
    title = models.CharField(max_length=100)
    person = models.ForeignKey('Person')
    organization = models.ForeignKey('Organization')
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return "{}, affiliated with {}".format(self.person, self.organization)
