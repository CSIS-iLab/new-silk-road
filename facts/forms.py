from django import forms
from django.contrib.postgres.forms import SplitArrayField
from django_select2.forms import (
    ModelSelect2Widget,
    ModelSelect2MultipleWidget,
)

from facts.models import (
    Person,
    OrganizationShareholder,
    PersonShareholder,
    Organization,
    CompanySector,
    CompanyDetails,
    FinancingOrganizationDetails,
    GovernmentDetails,
    MilitaryDetails,
    MultilateralDetails,
    NGODetails,
    PoliticalDetails,
)
from locations.models import (Country, Place)
from locations.forms import (CountrySearchMultiField, PlaceSearchField)


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


class OrganizationForm(forms.ModelForm):
    countries = CountrySearchMultiField(
        required=False,
        queryset=Country.objects.all(),
        help_text=CountrySearchMultiField.help_text
    )
    headquarters = PlaceSearchField(
        required=False,
        queryset=Place.objects.all(),
        help_text=PlaceSearchField.help_text
    )

    class Meta:
        model = Organization
        fields = '__all__'


class PersonForm(forms.ModelForm):
    citizenships = CountrySearchMultiField(
        required=False,
        queryset=Country.objects.all(),
        help_text=CountrySearchMultiField.help_text
    )

    class Meta:
        model = Person
        fields = '__all__'


class ShareholderFormBase(forms.ModelForm):
    investment = forms.ModelChoiceField(
        queryset=Organization.objects.all(),
        widget=NameSearchWidget(model=Organization),
        required=False
    )


class OrganizationShareholderForm(ShareholderFormBase):
    shareholder = forms.ModelChoiceField(
        label='Organization',
        queryset=Organization.objects.all(),
        widget=NameSearchWidget(model=Organization),
        required=True
    )

    class Meta:
        model = OrganizationShareholder
        fields = '__all__'


class PersonShareholderForm(ShareholderFormBase):
    shareholder = forms.ModelChoiceField(
        label='Person',
        queryset=Person.objects.all(),
        widget=PersonSearchWidget,
        required=True
    )

    class Meta:
        model = PersonShareholder
        fields = '__all__'


class OrganizationDetailForm(forms.ModelForm):
    organization = forms.ModelChoiceField(
        queryset=Organization.objects.all(),
        widget=NameSearchWidget(model=Organization),
        required=False
    )


class CompanyDetailsForm(OrganizationDetailForm):
    sectors = SplitArrayField(
        forms.TypedChoiceField(
            choices=((None, '-----'),) + CompanySector.CHOICES,
            required=False,
            empty_value=None,
            coerce=int
        ),
        size=len(CompanySector.CHOICES),
        remove_trailing_nulls=True
    )

    class Meta:
        model = CompanyDetails
        fields = '__all__'


class FinancingOrganizationDetailsForm(OrganizationDetailForm):
    class Meta:
        model = FinancingOrganizationDetails
        fields = '__all__'


class GovernmentDetailsForm(OrganizationDetailForm):
    class Meta:
        model = GovernmentDetails
        fields = '__all__'


class MilitaryDetailsForm(OrganizationDetailForm):
    class Meta:
        model = MilitaryDetails
        fields = '__all__'


class MultilateralDetailsForm(OrganizationDetailForm):
    class Meta:
        model = MultilateralDetails
        fields = '__all__'


class NGODetailsForm(OrganizationDetailForm):
    class Meta:
        model = NGODetails
        fields = '__all__'


class PoliticalDetailsForm(OrganizationDetailForm):
    class Meta:
        model = PoliticalDetails
        fields = '__all__'
