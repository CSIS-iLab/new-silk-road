from django.conf.urls import url

from .views import (
    PersonDetailView, PersonListView,
    EventDetailView, EventListView,

    OrganizationDetailView, OrganizationListView

    # CompanyDetailsView,
    # FinancingOrganizationDetailsView,
    # GovernmentDetailsView,
    # MilitaryDetailsView,
    # MultilateralDetailsView,
    # NGODetailsView,
    # PoliticalDetailsView,
)

urlpatterns = [
    url(r'^people/(?P<identifier>[a-f0-9-]{32,36})/$', PersonDetailView.as_view(), name='facts-person'),
    url(r'^people/$', PersonListView.as_view(), name='facts-person-list'),
    url(r'^organizations/(?P<slug>[-\w]+)/$', OrganizationDetailView.as_view(), name='facts-organization'),
    url(r'^organizations/$', OrganizationListView.as_view(), name='facts-organization-list'),
]
