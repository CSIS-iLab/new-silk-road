from django.db import models
from publish.models import Publishable
from markymark.fields import MarkdownField


class Event(Publishable):
    """Describes an event, one which may have a start and end date"""
    name = models.CharField(max_length=100)
    description = MarkdownField(blank=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    places = models.ManyToManyField('locations.Place', blank=True)
    documents = models.ManyToManyField('sources.Document', blank=True)
    notes = MarkdownField(blank=True)

    def __str__(self):
        return self.name
