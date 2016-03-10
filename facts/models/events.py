from django.db import models
from mptt.models import MPTTModel, TreeForeignKey
from publish.models import Publishable
from markymark.fields import MarkdownField


class EventType(MPTTModel):
    name = models.CharField(max_length=100)
    parent = TreeForeignKey('self', null=True, blank=True,
                            related_name='children', db_index=True)


class Event(Publishable):
    """Describes an event, one which may have a start and end date"""
    name = models.CharField(max_length=100)
    event_type = models.ForeignKey('EventType', verbose_name='type',
                                   on_delete=models.SET_NULL,
                                   blank=True, null=True)
    description = MarkdownField(blank=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    places = models.ManyToManyField('locations.Place', blank=True)
    documents = models.ManyToManyField('sources.Document', blank=True)
    notes = MarkdownField(blank=True)

    def __str__(self):
        return self.name
