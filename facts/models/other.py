from django.db import models
from django.contrib.postgres.fields import JSONField


class Data(models.Model):
    """JSON data, perhaps associated with a URL."""
    dictionary = JSONField()
    url = models.URLField(blank=True, max_length=1000)
    label = models.CharField(blank=True, max_length=100)

    def __str__(self):
        if self.label:
            return self.label
        elif self.url:
            return self.url
        return str(self.id)
