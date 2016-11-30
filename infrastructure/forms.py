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
)
from facts.models.organizations import Organization
from locations.forms import (
    GeometryStoreUploadForm,
    GeometrySearchField,
    CountrySearchMultiField
)
from locations.models import (
    Country,
    GeometryStore
)

MONTH_FIELD_KWARGS = (
    ('min_value', 1),
    ('max_value', 12),
)

DAY_FIELD_KWARGS = (
    ('min_value', 1),
    ('max_value', 31),
)


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

    founding_month = forms.IntegerField(**dict(MONTH_FIELD_KWARGS)),
    founding_day = forms.IntegerField(**dict(DAY_FIELD_KWARGS)),

    appeared_month = forms.IntegerField(**dict(MONTH_FIELD_KWARGS)),
    appeared_day = forms.IntegerField(**dict(DAY_FIELD_KWARGS)),

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

    start_month = forms.IntegerField(**dict(MONTH_FIELD_KWARGS)),
    start_day = forms.IntegerField(**dict(DAY_FIELD_KWARGS)),

    commencement_month = forms.IntegerField(**dict(MONTH_FIELD_KWARGS)),
    commencement_day = forms.IntegerField(**dict(DAY_FIELD_KWARGS)),

    planned_completion_month = forms.IntegerField(**dict(MONTH_FIELD_KWARGS)),
    planned_completion_day = forms.IntegerField(**dict(DAY_FIELD_KWARGS)),

    class Meta:
        model = Project
        fields = '__all__'
        widgets = {
            'sources': forms.Textarea(attrs={'cols': 200, 'rows': 4, 'style': 'width: 90%;'}),
        }


class ProjectFundingForm(forms.ModelForm):
    sources = NameSearchMultiField(
        required=False,
        queryset=Organization.objects.all()
    )
    project = forms.ModelChoiceField(
        queryset=Project.objects.all(),
        widget=NameSearchWidget(model=Project),
        required=False
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
