from django import forms
from django_select2.forms import (
    ModelSelect2Widget,
    ModelSelect2MultipleWidget,
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
            'countries': ModelSelect2MultipleWidget
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
    project = forms.ChoiceField(
        widget=ModelSelect2Widget(
            model=Project,
            search_fields=['name__icontains']
        ),
        required=False
    )
