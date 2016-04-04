from django.views.generic.detail import DetailView
from django.views.generic.list import ListView

from .models import (
    Person,
    Organization,
    Event,
)


class PersonDetailView(DetailView):
    model = Person
    slug_field = 'identifier'
    slug_url_kwarg = 'identifier'


class PersonListView(ListView):
    model = Person
    paginate_by = 50


class EventDetailView(DetailView):
    model = Event


class EventListView(ListView):
    model = Event
    paginate_by = 50


# Organization stuff
class OrganizationDetailView(DetailView):
    model = Organization


class OrganizationListView(ListView):
    model = Organization
    paginate_by = 50
    display_name_plural = None

    def get_context_data(self, **kwargs):
        context = super(OrganizationListView, self).get_context_data(**kwargs)
        if hasattr(self, 'display_name_plural'):
            context['display_name_plural'] = self.display_name_plural
        return context


class CompanyListView(OrganizationListView):
    queryset = Organization.objects.filter(companydetails__isnull=False)
    display_name_plural = 'Companies'


class FinancingOrganizationListView(OrganizationListView):
    queryset = Organization.objects.filter(financingorganizationdetails__isnull=False)
    display_name_plural = 'Financing Organizations'


class GovernmentListView(OrganizationListView):
    queryset = Organization.objects.filter(governmentdetails__isnull=False)
    display_name_plural = 'Governments'


class MilitaryListView(OrganizationListView):
    queryset = Organization.objects.filter(militarydetails__isnull=False)
    display_name_plural = 'Militaries'


class MultilateralListView(OrganizationListView):
    queryset = Organization.objects.filter(multilateraldetails__isnull=False)
    display_name_plural = 'Multilaterals'


class NGOListView(OrganizationListView):
    queryset = Organization.objects.filter(ngodetails__isnull=False)
    display_name_plural = 'Non-governmental organizations'


class PoliticalListView(OrganizationListView):
    queryset = Organization.objects.filter(politicaldetails__isnull=False)
    display_name_plural = 'Politcal Entities'
