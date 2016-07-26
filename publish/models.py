from django.db import models


class PublishableQuerySet(models.QuerySet):

    def published(self):
        return self.filter(published=True)

    def unpublished(self):
        return self.filter(published=False)


class Temporal(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Publishable(Temporal):
    published = models.BooleanField(default=False)

    objects = PublishableQuerySet.as_manager()

    class Meta:
        abstract = True
