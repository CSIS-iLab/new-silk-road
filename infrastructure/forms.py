from django import forms
from django_select2.forms import (
    ModelSelect2Widget,
    ModelSelect2MultipleWidget,
)
from infrastructure.models import (
    Initiative, OwnerStake, PowerPlant, Project, ProjectFunding, ProjectDocument
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
from sources.forms import DocumentSearchField, DocumentSearchMultiField
from sources.models import Document


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
    affiliated_organizations = OrganizationSearchMultiField(required=False)
    affiliated_people = PersonSearchMultiField(required=False, queryset=Person.objects.all())
    documents = DocumentSearchMultiField(required=False, queryset=Document.objects.all())

    founding_month = MonthField(required=False)
    founding_day = DayField(required=False)

    appeared_month = MonthField(required=False)
    appeared_day = DayField(required=False)

    class Meta:
        model = Initiative
        fields = '__all__'


class ProjectSearchMultiField(forms.ModelMultipleChoiceField):
    widget = ModelSelect2MultipleWidget(
        model=Project, attrs={'style': 'width: 75%'},
        search_fields=('name__icontains', ))

    def __init__(self, *args, **kwargs):
        kwargs['queryset'] = Project.objects.all()
        kwargs['help_text'] = 'Select field and begin typing to search'
        super().__init__(*args, **kwargs)


class ProjectDocumentForm(forms.ModelForm):
    document = DocumentSearchField(
        required=False,
        queryset=Document.objects.order_by('-id'),
        help_text=DocumentSearchField.help_text
    )

    class Meta:
        model = ProjectDocument
        fields = '__all__'


class ProjectDocumentSearchMultiWidget(ModelSelect2MultipleWidget):
    model = ProjectDocument
    search_fields = [
        'notes__icontains',
        'document__url__icontains',
    ]


class ProjectDocumentSearchMultiField(forms.ModelMultipleChoiceField):
    widget = ProjectDocumentSearchMultiWidget
    help_text = "Select field and begin typing a country's name to search"


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
    manufacturers = OrganizationSearchMultiField(required=False)
    consultants = OrganizationSearchMultiField(required=False)
    implementers = OrganizationSearchMultiField(required=False)
    operators = OrganizationSearchMultiField(required=False)

    contacts = PersonSearchMultiField(required=False, queryset=Person.objects.all())
    documents = ProjectDocumentSearchMultiField(
        required=False,
        queryset=ProjectDocument.objects.all()
    )

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
    operators = OrganizationSearchMultiField(required=False)
    projects = ProjectSearchMultiField(required=False)
    plant_month_online = MonthField(required=False)
    plant_day_online = DayField(required=False)
    decommissioning_month = MonthField(required=False)
    decommissioning_day = DayField(required=False)
    geo = GeometrySearchField(
        required=False,
        queryset=GeometryStore.objects.all(),
        help_text=GeometrySearchField.help_text
    )

    class Meta:
        model = PowerPlant
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        """Display all of the PowerPlant's current projects as initial data."""
        if kwargs.get('instance'):
            kwargs.update(initial={'projects': kwargs['instance'].project_set.all()})
        super().__init__(*args, **kwargs)

    def _save_m2m(self, *args, **kwargs):
        """
        Save the PowerPlant's Projects.

        All of the other uses of Django-Select2 are for Many-To-Many fields, but
        since the projects field is a Many-To-One field (a ForeignKey), it doesn't
        get handled the same way by Django and Django-Select2.
        """
        super()._save_m2m(*args, **kwargs)
        # Get the project ids from either the QueryDict or the dictionary
        project_ids = []
        if hasattr(self.data, 'getlist'):
            project_ids = self.data.getlist('projects')
        elif self.data.get('projects'):
            project_ids = [project.id for project in self.data.get('projects')]

        # Add Projects whose ids are in the project_ids list
        for project in Project.objects.filter(id__in=project_ids):
            self.instance.project_set.add(project)
        # Remove any Projects whose ids are not in the project_ids list
        for project in self.instance.project_set.exclude(id__in=project_ids):
            self.instance.project_set.remove(project)


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


class ProjectOwnerStakeForm(forms.ModelForm):
    class Meta:
        model = OwnerStake
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
