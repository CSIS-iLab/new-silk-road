from django.db import models
from publish.models import Temporal
from filer.fields.file import FilerFileField


class Document(Temporal):
    """A Document"""
    source_file = FilerFileField(verbose_name='File')
    url = models.URLField('URL', blank=True)

    def __str__(self):
        return self.name
