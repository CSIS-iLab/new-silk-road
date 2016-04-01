from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.urlresolvers import reverse
from locations.models import COUNTRY_CHOICES, countries
from markymark.fields import MarkdownField
from publish.models import Publishable
import uuid


class Person(Publishable):
    """Describes a person"""
    identifier = models.UUIDField(default=uuid.uuid4, editable=False)
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

    class Meta:
        verbose_name_plural = 'people'

    def __str__(self):
        return " ".join((self.given_name, self.family_name))

    def citizenships_names(self):
        return ", ".join((countries.get(s).name for s in self.citizenships)) if self.citizenships else None
    citizenships_names.short_description = 'Citizenships'

    def full_display_name(self):
        name_parts = (self.given_name, self.additional_name or None, self.family_name)
        return " ".join([x for x in name_parts if x])

    def get_absolute_url(self):
        return reverse('facts-person', args=[str(self.identifier)])


class Position(models.Model):
    """Describes a position a person holds/held at an organization"""
    title = models.CharField(max_length=100)
    person = models.ForeignKey('Person')
    organization = models.ForeignKey('Organization')
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)

    class Meta:
        verbose_name = 'position (job)'
        verbose_name_plural = 'positions (jobs)'

    def __str__(self):
        return "{}, affiliated with {}".format(self.person, self.organization)
