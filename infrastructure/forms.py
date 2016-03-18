from django import forms
from django_select2.forms import (
    Select2MultipleWidget,
)
from locations.fields import CountryMultipleChoiceField
from infrastructure.models import (
    Project, Initiative, ProjectFunding
)
from facts.forms import (
    TitleSearchWidget,
    TitleSearchMultiField,
    PersonSearchMultiWidget
)
from facts.models.organizations import Organization
from facts.models import Person


class InitiativeForm(forms.ModelForm):
    member_countries = CountryMultipleChoiceField(
        required=False,
        widget=Select2MultipleWidget,
        help_text='Start typing to search for countries.'
    )

    class Meta:
        model = Initiative
        fields = '__all__'


class ProjectForm(forms.ModelForm):
    countries = CountryMultipleChoiceField(
        required=False,
        widget=Select2MultipleWidget,
        help_text='Start typing to search for countries.'
    )
    contractors = TitleSearchMultiField(
        required=False,
        queryset=Organization.objects.all(),
        help_text='Select field and begin typing a title to search'
    )
    consultants = TitleSearchMultiField(
        required=False,
        queryset=Organization.objects.all(),
        help_text='Select field and begin typing a title to search'
    )
    implementers = TitleSearchMultiField(
        required=False,
        queryset=Organization.objects.all(),
        help_text='Select field and begin typing a title to search'
    )
    contacts = forms.ModelMultipleChoiceField(
        widget=PersonSearchMultiWidget,
        required=False,
        queryset=Person.objects.all(),
        help_text='Select field and begin typing a name to search'
    )

    class Meta:
        model = Project
        fields = '__all__'
        widgets = {
            'sources': forms.Textarea(attrs={'cols': 200, 'rows': 4, 'style': 'width: 90%;'}),
            'initiative': TitleSearchWidget,
            'operator': TitleSearchWidget,
        }


class ProjectFundingForm(forms.ModelForm):

    class Meta:
        model = ProjectFunding
        fields = '__all__'
        widgets = {
            'source': TitleSearchWidget
        }
