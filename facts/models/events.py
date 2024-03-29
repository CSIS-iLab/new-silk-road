from django.db import models
from django.core.urlresolvers import reverse
from django.utils.text import slugify
from mptt.models import MPTTModel, TreeForeignKey
from publish.models import Publishable
from markymark.fields import MarkdownField
from markymark.utils import render_markdown
from utilities.date import fuzzydate


class EventType(MPTTModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=110, allow_unicode=True)
    parent = TreeForeignKey('self', models.CASCADE,
                            null=True, blank=True,
                            related_name='children', db_index=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug or self.slug == '':
            self.slug = slugify(self.name, allow_unicode=True)
        super(EventType, self).save(*args, **kwargs)

    # def get_absolute_url(self):
    #     return reverse('facts:event-type-detail', args=[self.slug])

    class Meta:
        ordering = ['id']


class Event(Publishable):
    """Describes an event, one which may have a start and end date"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=110, allow_unicode=True, unique=True)
    event_type = models.ForeignKey('EventType', models.SET_NULL,
                                   verbose_name='type',
                                   blank=True, null=True)
    description = MarkdownField(blank=True)
    description_rendered = models.TextField(blank=True, editable=False)
    start_year = models.PositiveSmallIntegerField(blank=True, null=True)
    start_month = models.PositiveSmallIntegerField(blank=True, null=True)
    start_day = models.PositiveSmallIntegerField(blank=True, null=True)

    @property
    def fuzzy_start_date(self):
        return fuzzydate(self.start_year, self.start_month, self.start_day)

    end_year = models.PositiveSmallIntegerField(blank=True, null=True)
    end_month = models.PositiveSmallIntegerField(blank=True, null=True)
    end_day = models.PositiveSmallIntegerField(blank=True, null=True)

    @property
    def fuzzy_end_date(self):
        return fuzzydate(self.end_year, self.end_month, self.end_day)

    places = models.ManyToManyField('locations.Place', blank=True)
    documents = models.ManyToManyField('sources.Document', blank=True)
    notes = MarkdownField(blank=True)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('facts:event-detail', args=[self.slug])

    def save(self, *args, **kwargs):
        self.description_rendered = render_markdown(self.description)
        if not self.slug or self.slug == '':
            self.slug = slugify(self.name, allow_unicode=True)
        super(Event, self).save(*args, **kwargs)

    class Meta:
        ordering = ['created_at']
