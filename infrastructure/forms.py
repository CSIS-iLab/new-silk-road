from django import forms
from django_select2.forms import (
    ModelSelect2Widget,
)
from infrastructure.models import (
    Project, Initiative, ProjectFunding
)
from facts.forms import (
    NameSearchWidget,
    NameSearchMultiField,
    PersonSearchWidget,
    PersonSearchMultiField
)
from facts.models.organizations import Organization
from facts.models import (Person, Event)
from locations.forms import (GeometryStoreUploadForm, CountrySearchMultiField)
from locations.models import Country


class GeometrySearchWidget(ModelSelect2Widget):
    search_fields = [
        'label__icontains',
    ]


class InitiativeForm(forms.ModelForm):
    affiliated_people = PersonSearchMultiField(
        required=False,
        queryset=Person.objects.all(),
        help_text=PersonSearchMultiField.help_text
    )
    member_countries = CountrySearchMultiField(
        required=False,
        queryset=Country.objects.all(),
        help_text=CountrySearchMultiField.help_text
    )
    affiliated_organizations = NameSearchMultiField(
        required=False,
        queryset=Organization.objects.all(),
        help_text=NameSearchMultiField.help_text
    )
    affiliated_events = NameSearchMultiField(
        required=False,
        queryset=Event.objects.all(),
        help_text=NameSearchMultiField.help_text
    )

    class Meta:
        model = Initiative
        fields = '__all__'
        widgets = {
            'parent': NameSearchWidget,
            'principal_agent': PersonSearchWidget
        }


class ProjectForm(forms.ModelForm):
    initiatives = NameSearchMultiField(
        required=False,
        queryset=Initiative.objects.all(),
        help_text=NameSearchMultiField.help_text
    )
    contractors = NameSearchMultiField(
        required=False,
        queryset=Organization.objects.all(),
        help_text=NameSearchMultiField.help_text
    )
    consultants = NameSearchMultiField(
        required=False,
        queryset=Organization.objects.all(),
        help_text=NameSearchMultiField.help_text
    )
    implementers = NameSearchMultiField(
        required=False,
        queryset=Organization.objects.all(),
        help_text=NameSearchMultiField.help_text
    )
    operators = NameSearchMultiField(
        required=False,
        queryset=Organization.objects.all(),
        help_text=NameSearchMultiField.help_text
    )
    contacts = PersonSearchMultiField(
        required=False,
        queryset=Person.objects.all(),
        help_text=PersonSearchMultiField.help_text
    )
    countries = CountrySearchMultiField(
        required=False,
        queryset=Country.objects.all(),
        help_text=CountrySearchMultiField.help_text
    )

    class Meta:
        model = Project
        fields = '__all__'
        widgets = {
            'sources': forms.Textarea(attrs={'cols': 200, 'rows': 4, 'style': 'width: 90%;'}),
            'geo': GeometrySearchWidget
        }


class ProjectFundingForm(forms.ModelForm):
    sources = NameSearchMultiField(
        required=False,
        queryset=Organization.objects.all()
    )

    class Meta:
        model = ProjectFunding
        fields = '__all__'
        widgets = {
            'project': NameSearchWidget
        }


class ProjectGeoUploadForm(GeometryStoreUploadForm):
    project = forms.ModelChoiceField(
        queryset=Project.objects.all(),
        widget=ModelSelect2Widget(
            model=Project,
            search_fields=['name__icontains']
        ),
        required=False
    )
