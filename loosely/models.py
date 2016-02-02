from django.db import models
from taggit.managers import TaggableManager


class EntryType(models.Model):
    """Defines an entry type"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(allow_unicode=True)

    def __str__(self):
        return self.name


class Entry(models.Model):
    """Entries about various things"""
    title = models.CharField(max_length=100)
    slug = models.SlugField(allow_unicode=True)
    entry_type = models.ForeignKey(EntryType)
    body = models.TextField(blank=True)

    tags = TaggableManager(blank=True)

    class Meta:
        verbose_name_plural = 'Entries'

    def __str__(self):
        return "Entry: '{}'".format(self.slug)
