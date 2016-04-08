from django import forms
from django_select2.forms import (
    ModelSelect2Widget,
    ModelSelect2MultipleWidget,
)

from facts.models import (Person)


class TitleSearchFieldMixin(object):
    search_fields = [
        'title__icontains',
    ]


class TitleSearchWidget(TitleSearchFieldMixin, ModelSelect2Widget):
    help_text = 'Foo'


class TitleSearchMultiWidget(TitleSearchFieldMixin, ModelSelect2MultipleWidget):
    pass


class TitleSearchMultiField(forms.ModelMultipleChoiceField):
    widget = TitleSearchMultiWidget
    help_text = 'Start typing to search.'


class NameSearchFieldsMixin(object):
    search_fields = [
        'given_name__icontains',
        'family_name__icontains',
        'additional_name__icontains'
    ]


class PersonSearchWidget(NameSearchFieldsMixin, ModelSelect2Widget):
    model = Person


class PersonSearchMultiWidget(NameSearchFieldsMixin, ModelSelect2MultipleWidget):
    model = Person
