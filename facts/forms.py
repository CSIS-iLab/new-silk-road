from django import forms
from django_select2.forms import (
    ModelSelect2Widget,
    ModelSelect2MultipleWidget,
)

from facts.models import (
    Person,
    OrganizationShareholder,
    PersonShareholder,
    Organization,
)


class NameSearchFieldMixin(object):
    search_fields = [
        'name__icontains',
    ]


class NameSearchWidget(NameSearchFieldMixin, ModelSelect2Widget):
    pass


class NameSearchMultiWidget(NameSearchFieldMixin, ModelSelect2MultipleWidget):
    pass


class NameSearchMultiField(forms.ModelMultipleChoiceField):
    widget = NameSearchMultiWidget
    help_text = 'Select field and begin typing to search'


class PersonSearchFieldsMixin(object):
    search_fields = [
        'given_name__icontains',
        'family_name__icontains',
        'additional_name__icontains'
    ]


class PersonSearchWidget(PersonSearchFieldsMixin, ModelSelect2Widget):
    model = Person


class PersonSearchMultiWidget(PersonSearchFieldsMixin, ModelSelect2MultipleWidget):
    model = Person


class PersonSearchMultiField(forms.ModelMultipleChoiceField):
    widget = PersonSearchMultiWidget
    help_text = "Select field and begin typing a person's name to search"


class ShareholderFormBase(forms.ModelForm):
    investment = forms.ModelChoiceField(
        queryset=Organization.objects.all(),
        widget=NameSearchWidget(model=Organization),
        required=False
    )


class OrganizationShareholderForm(ShareholderFormBase):
    shareholder = forms.ModelChoiceField(
        queryset=Organization.objects.all(),
        widget=NameSearchWidget(model=Organization),
        required=False
    )

    class Meta:
        model = OrganizationShareholder
        fields = '__all__'


class PersonShareholderForm(ShareholderFormBase):
    shareholder = forms.ModelChoiceField(
        queryset=Person.objects.all(),
        widget=PersonSearchWidget,
        required=False
    )

    class Meta:
        model = PersonShareholder
        fields = '__all__'
