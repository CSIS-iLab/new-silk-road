from django import forms
from django_select2.forms import (
    ModelSelect2Widget,
    ModelSelect2MultipleWidget,
)
from sources.models import Document


class DocumentSearchFieldsMixin(object):
    model = Document
    search_fields = [
        'source_file__original_filename__icontains',
        'url__icontains',
    ]


class DocumentSearchWidget(DocumentSearchFieldsMixin, ModelSelect2Widget):
    pass


class DocumentSearchField(forms.ModelChoiceField):
    widget = DocumentSearchWidget
    help_text = "Select field and begin typing a document's name to search"


class DocumentSearchMultiWidget(DocumentSearchFieldsMixin, ModelSelect2MultipleWidget):
    pass


class DocumentSearchMultiField(forms.ModelMultipleChoiceField):
    widget = DocumentSearchMultiWidget
    help_text = "Select field and begin typing a document's name to search"
