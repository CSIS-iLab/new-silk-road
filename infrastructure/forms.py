from django import forms
from django_select2.forms import (
    ModelSelect2Widget,
    ModelSelect2MultipleWidget,
    ModelSelect2Widget,
)
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
    operators = TitleSearchMultiField(
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
            'countries': ModelSelect2MultipleWidget,
            'geo': GeometrySearchWidget
        }


class ProjectFundingForm(forms.ModelForm):

    class Meta:
        model = ProjectFunding
        fields = '__all__'
        widgets = {
            'source': TitleSearchWidget,
            'project': TitleSearchWidget
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
