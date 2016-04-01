from django.views.generic.detail import DetailView
from django.views.generic.list import ListView

from .models import (
    Person,
    Organization,
    CompanyDetails, FinancingOrganizationDetails, GovernmentDetails,
    MilitaryDetails, MultilateralDetails, NGODetails, PoliticalDetails,

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


# Organization stuff
class OrganizationDetailView(DetailView):
    model = Organization


class OrganizationListView(ListView):
    model = Organization


# Organization detailsviews
class CompanyDetailsView(DetailView):
    model = CompanyDetails


class FinancingOrganizationDetailsView(DetailView):
    model = FinancingOrganizationDetails


class GovernmentDetailsView(DetailView):
    model = GovernmentDetails


class MilitaryDetailsView(DetailView):
    model = MilitaryDetails


class MultilateralDetailsView(DetailView):
    model = MultilateralDetails


class NGODetailsView(DetailView):
    model = NGODetails


class PoliticalDetailsView(DetailView):
    model = PoliticalDetails
