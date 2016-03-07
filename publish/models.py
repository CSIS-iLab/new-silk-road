from django.db import models


class PublicationManager(models.Manager):

    def published(self):
        return self.get_queryset().filter(published=True)

    def unpublished(self):
        return self.get_queryset().filter(published=False)


class Temporal(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Publishable(Temporal):
    published = models.BooleanField(default=False)

    objects = PublicationManager()

    class Meta:
        abstract = True
