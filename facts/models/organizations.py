from django.db import models
from taggit.managers import TaggableManager
from publish.models import Publishable
from markymark.fields import MarkdownField
from mptt.models import MPTTModel, TreeForeignKey


class OrganizationBase(Publishable):
    """Abstract base model for organizations"""
    name = models.CharField(max_length=100)
    leaders = models.ManyToManyField('Person', related_name='%(class)s_led')
    initiatives = models.ManyToManyField('Initiative', related_name='%(class)s_related')
    # TODO: Check type of headquarters as they may want an address or geodata.
    headquarters = models.CharField(blank=True, max_length=100)
    notes = MarkdownField(blank=True, help_text='Notes for display on website')

    class Meta:
        abstract = True


class Organization(Publishable):
    """Describes an organization"""
    name = models.CharField(max_length=200)
    parent = models.ForeignKey('self', related_name='children', null=True, blank=True)
    founding_date = models.DateField(blank=True, null=True)
    dissolution_date = models.DateField(blank=True, null=True)
    events = models.ManyToManyField('Event', blank=True)
    people = models.ManyToManyField('Person', through='Position',
                                    help_text="People who are associated with this organization.")
    headquarters = models.ManyToManyField('Place', blank=True)

    tags = TaggableManager(blank=True)

    def __str__(self):
        return self.name


class Position(models.Model):
    """Describes a position a person holds/held at an organization"""
    title = models.CharField(max_length=100)
    person = models.ForeignKey('Person')
    organization = models.ForeignKey('Organization')
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return "{}, affiliated with {}".format(self.person, self.organization)
