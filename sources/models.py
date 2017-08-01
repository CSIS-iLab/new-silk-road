from django.db import models
from publish.models import Temporal
from filer.fields.file import FilerFileField
from utilities.validators import URLLikeValidator


class Document(Temporal):
    """A Document"""
    url = models.CharField('URL', blank=True, max_length=1000, validators=[URLLikeValidator])
    source_file = FilerFileField(verbose_name='File')

    def __str__(self):
        if self.source_file and self.source_file.original_filename:
            return self.source_file.original_filename
        return "Document #{}".format(self.id) if self.id else "Unsaved Document"
