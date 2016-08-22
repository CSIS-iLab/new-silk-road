from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


model_choices = models.Q(app_label='infrastructure', model__in=('project', 'initiative')) |\
    models.Q(app_label='facts', model__in=('event', 'organization', 'person'))


class CollectionItem(models.Model):
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        limit_choices_to=model_choices
    )
    object_id = models.PositiveIntegerField(help_text='Numeric id of the object.')
    content_object = GenericForeignKey('content_type', 'object_id')
    collection = models.ForeignKey('website.Collection', related_name='items')
    order = models.PositiveIntegerField(blank=True, null=True)

    class Meta:
        ordering = ['collection_id', 'order']

    def __str__(self):
        return '{} {}: "{}"'.format(self.content_type.model.title(), self.object_id, str(self.content_object))


class Collection(models.Model):
    """Collection of generic items"""
    name = models.CharField(max_length=100)
    slug = models.SlugField()

    def __str__(self):
        return self.name
