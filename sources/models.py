from django.db import models
from publish.models import Temporal
from filer.fields.file import FilerFileField
from datautils.validators import URLLikeValidator


class Document(Temporal):
    """A Document"""
    source_file = FilerFileField(verbose_name='File')
    url = models.CharField('URL', blank=True, max_length=1000, validators=[URLLikeValidator])

    def __str__(self):
        if self.source_file:
            return self.source_file.original_filename
        return "Document #{}".format(self.id)
