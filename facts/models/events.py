from django.db import models
from taggit.managers import TaggableManager
from publish.models import Publishable


class Event(Publishable):
    """Describes an event, one which may have a start and end date"""
    name = models.CharField(blank=True, max_length=100)
    description = models.TextField(blank=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    places = models.ManyToManyField('Place', blank=True)

    tags = TaggableManager(blank=True)

    def __str__(self):
        return self.name
