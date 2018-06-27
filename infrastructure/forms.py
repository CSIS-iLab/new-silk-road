from django import forms
from django_select2.forms import ModelSelect2Widget
from infrastructure.models import (
    Project, Initiative, ProjectFunding, PowerPlant
)
from facts.forms import NameSearchWidget, PersonSearchMultiField, OrganizationSearchMultiField
from facts.models.organizations import Organization
from facts.models.people import Person
from locations.forms import (
    GeometryStoreUploadForm,
    GeometrySearchField,
    CountrySearchMultiField
)
from locations.models import (
    Country,
    GeometryStore
)


class MonthField(forms.IntegerField):

    def __init__(self, *args, **kwargs):
        help_text = kwargs.get('help_text', 'Enter a whole number representing the month (1-12)')
        kwargs.update({
            'min_value': 1,
            'max_value': 12,
            'help_text': help_text,
        })
        super(MonthField, self).__init__(*args, **kwargs)


class DayField(forms.IntegerField):

    def __init__(self, *args, **kwargs):
        help_text = kwargs.get('help_text', 'Enter a whole number representing a day in the range 1-31')
        kwargs.update({
            'min_value': 1,
            'max_value': 31,
            'help_text': help_text,
        })
        super(DayField, self).__init__(*args, **kwargs)


class InitiativeForm(forms.ModelForm):
    member_countries = CountrySearchMultiField(
        required=False,
        queryset=Country.objects.all(),
        help_text=CountrySearchMultiField.help_text
    )
    parent = forms.ModelChoiceField(
        queryset=Initiative.objects.all(),
        widget=NameSearchWidget(model=Initiative),
        required=False
    )
    principal_agent = forms.ModelChoiceField(
        queryset=Organization.objects.all(),
        widget=NameSearchWidget(model=Organization),
        required=False
    )

    founding_month = MonthField(required=False)
    founding_day = DayField(required=False)

    appeared_month = MonthField(required=False)
    appeared_day = DayField(required=False)

    class Meta:
        model = Initiative
        fields = '__all__'


class ProjectForm(forms.ModelForm):
    countries = CountrySearchMultiField(
        required=False,
        queryset=Country.objects.all(),
        help_text=CountrySearchMultiField.help_text
    )
    geo = GeometrySearchField(
        required=False,
        queryset=GeometryStore.objects.all(),
        help_text=GeometrySearchField.help_text
    )
    contractors = OrganizationSearchMultiField(required=False)
    consultants = OrganizationSearchMultiField(required=False)
    implementers = OrganizationSearchMultiField(required=False)
    operators = OrganizationSearchMultiField(required=False)

    contacts = PersonSearchMultiField(required=False, queryset=Person.objects.all())

    start_month = MonthField(required=False)
    start_day = DayField(required=False)

    commencement_month = MonthField(required=False)
    commencement_day = DayField(required=False)

    planned_completion_month = MonthField(required=False)
    planned_completion_day = DayField(required=False)

    class Meta:
        model = Project
        fields = '__all__'
        widgets = {
            'sources': forms.Textarea(attrs={'cols': 200, 'rows': 4, 'style': 'width: 90%;'}),
        }

class PowerPlantForm(forms.ModelForm):
    countries = CountrySearchMultiField(
        required=False,
        queryset=Country.objects.all(),
        help_text=CountrySearchMultiField.help_text
    )
    owners = OrganizationSearchMultiField(required=False)
    operators = OrganizationSearchMultiField(required=False)
    plant_month_online = MonthField(required=False)
    plant_day_online = DayField(required=False)
    decommissioning_month = MonthField(required=False)
    decommissioning_day = DayField(required=False)

    class Meta:
        model = PowerPlant
        fields = '__all__'

class ProjectFundingForm(forms.ModelForm):
    sources = OrganizationSearchMultiField(required=False)
    project = forms.ModelChoiceField(
        queryset=Project.objects.all(),
        widget=NameSearchWidget(model=Project),
        required=True
    )

    class Meta:
        model = ProjectFunding
        fields = '__all__'


class ProjectGeoUploadForm(GeometryStoreUploadForm):
    project = forms.ModelChoiceField(
        queryset=Project.objects.all(),
        widget=ModelSelect2Widget(
            model=Project,
            search_fields=['name__icontains']
        ),
        required=False
    )
