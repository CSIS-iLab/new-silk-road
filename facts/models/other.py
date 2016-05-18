from django.db import models
from django.contrib.postgres.fields import JSONField
from utilities.validators import URLLikeValidator


class Data(models.Model):
    """JSON data, perhaps associated with a URL."""
    dictionary = JSONField()
    url = models.CharField(blank=True, max_length=1000, validators=[URLLikeValidator])
    label = models.CharField(blank=True, max_length=100)

    def __str__(self):
        if self.label:
            return self.label
        elif self.url:
            return self.url
        return str(self.id)
