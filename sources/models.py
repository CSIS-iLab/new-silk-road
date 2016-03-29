from django.db import models
from publish.models import Temporal
from filer.fields.file import FilerFileField


class Document(Temporal):
    """A Document"""
    source_file = FilerFileField(verbose_name='File')
    url = models.URLField('URL', blank=True, max_length=1000)

    def __str__(self):
        return self.name
