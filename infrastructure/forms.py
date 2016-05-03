from django import forms
from django_select2.forms import (
    ModelSelect2Widget,
    ModelSelect2MultipleWidget,
)
from infrastructure.models import (
    Project, Initiative, ProjectFunding
)
from facts.forms import (
    NameSearchWidget,
    NameSearchMultiField,
    PersonSearchMultiWidget
)
from facts.models.organizations import Organization
from facts.models import Person
from locations.forms import GeometryStoreUploadForm


class GeometrySearchWidget(ModelSelect2Widget):
    search_fields = [
        'label__icontains',
    ]


class InitiativeForm(forms.ModelForm):

    class Meta:
        model = Initiative
        fields = '__all__'
        widgets = {
            'member_countries': ModelSelect2MultipleWidget
        }


class ProjectForm(forms.ModelForm):
    initiatives = NameSearchMultiField(
        required=False,
        queryset=Initiative.objects.all(),
        help_text='Select field and begin typing a title to search'
    )
    contractors = NameSearchMultiField(
        required=False,
        queryset=Organization.objects.all(),
        help_text='Select field and begin typing a title to search'
    )
    consultants = NameSearchMultiField(
        required=False,
        queryset=Organization.objects.all(),
        help_text='Select field and begin typing a title to search'
    )
    implementers = NameSearchMultiField(
        required=False,
        queryset=Organization.objects.all(),
        help_text='Select field and begin typing a title to search'
    )
    operators = NameSearchMultiField(
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
            'initiative': NameSearchWidget,
            'countries': ModelSelect2MultipleWidget,
            'geo': GeometrySearchWidget
        }


class ProjectFundingForm(forms.ModelForm):
    sources = NameSearchMultiField(
        required=False,
        queryset=Organization.objects.all(),
        help_text='Select field and begin typing a title to search'
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
