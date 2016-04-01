from django.db import models
from django.core.urlresolvers import reverse
from mptt.models import MPTTModel, TreeForeignKey
from publish.models import Publishable
from markymark.fields import MarkdownField


class EventType(MPTTModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=110)
    parent = TreeForeignKey('self', null=True, blank=True,
                            related_name='children', db_index=True)

    def __str__(self):
        return self.name

    # def get_absolute_url(self):
    #     return reverse('facts-event-type-detail', args=[self.slug])


class Event(Publishable):
    """Describes an event, one which may have a start and end date"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=110)
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

    def get_absolute_url(self):
        return reverse('facts-event-detail', args=[self.slug])
