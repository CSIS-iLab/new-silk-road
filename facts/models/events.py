from django.db import models
from taggit.managers import TaggableManager
from publish.models import Publishable
from markymark.fields import MarkdownField


class Event(Publishable):
    """Describes an event, one which may have a start and end date"""
    name = models.CharField(max_length=100)
    description = MarkdownField(blank=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    places = models.ManyToManyField('locations.Place', blank=True)

    tags = TaggableManager(blank=True)

    def __str__(self):
        return self.name
