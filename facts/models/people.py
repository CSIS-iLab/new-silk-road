from django.db import models
from django.core.urlresolvers import reverse
from django.utils.text import slugify
from markymark.fields import MarkdownField
from publish.models import Publishable
from markymark.utils import render_markdown
from filer.fields.image import FilerImageField
import uuid


class Person(Publishable):
    """Describes a person"""
    identifier = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    # Name info
    given_name = models.CharField('First name', max_length=100, help_text="A person's given or 'first' name(s).")
    additional_name = models.CharField('Middle name', blank=True, max_length=100, help_text="An additional name for a person, \
                                                                              such as a 'middle' name.")
    family_name = models.CharField('Last name', blank=True, max_length=140, help_text="A person's family or 'last' name(s).")

    image = FilerImageField(blank=True, null=True, help_text='Preferably a portrait/"head shot".')

    # Biographical Info
    description = MarkdownField('Bio/Description', blank=True)
    description_rendered = models.TextField(blank=True, editable=False)
    citizenships = models.ManyToManyField('locations.Country', blank=True)

    birth_year = models.PositiveSmallIntegerField(blank=True, null=True)
    birth_month = models.PositiveSmallIntegerField(blank=True, null=True)
    birth_day = models.PositiveSmallIntegerField(blank=True, null=True)

    # Notes
    notes = MarkdownField(blank=True)

    # Relations
    events = models.ManyToManyField('Event', blank=True)

    class Meta:
        ordering = ['family_name', 'given_name', 'additional_name']
        verbose_name_plural = 'people'

    def __str__(self):
        return " ".join((self.given_name, self.family_name))

    def full_display_name(self):
        name_parts = (self.given_name, self.additional_name or None, self.family_name)
        return " ".join([x for x in name_parts if x])
    full_display_name.short_description = "Full name"

    def get_absolute_url(self):
        return reverse('facts:person-detail', kwargs={
            'slug': slugify(self.full_display_name()),
            'identifier': str(self.identifier)
        })

    def save(self, *args, **kwargs):
        self.description_rendered = render_markdown(self.description)
        super(Person, self).save(*args, **kwargs)


class Position(models.Model):
    """Describes a position a person holds/held at an organization"""
    title = models.CharField(max_length=100)
    person = models.ForeignKey('Person')
    organization = models.ForeignKey('Organization')

    start_year = models.PositiveSmallIntegerField(blank=True, null=True)
    start_month = models.PositiveSmallIntegerField(blank=True, null=True)
    start_day = models.PositiveSmallIntegerField(blank=True, null=True)

    end_year = models.PositiveSmallIntegerField(blank=True, null=True)
    end_month = models.PositiveSmallIntegerField(blank=True, null=True)
    end_day = models.PositiveSmallIntegerField(blank=True, null=True)

    class Meta:
        verbose_name = 'position (job)'
        verbose_name_plural = 'positions (jobs)'

    def __str__(self):
        return "{}, affiliated with {}".format(self.person, self.organization)
