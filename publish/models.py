from django.db import models

class PublicationManager(models.Manager):

    def published(self):
        return self.get_queryset().filter(published=True)

    def unpublished(self):
        return self.get_queryset().filter(published=False)


class Publishable(models.Model):
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = PublicationManager()

    class Meta:
        abstract = True
