from django.conf.urls import url

from .views import (
    PersonDetailView, PersonListView,
    EventDetailView, EventListView,

    OrganizationDetailView, OrganizationListView,
    CompanyListView,
    FinancingOrganizationListView,
    GovernmentListView,
    MilitaryListView,
    MultilateralListView,
    NGOListView,
    PoliticalListView
)

urlpatterns = [
    url(r'^people/(?P<identifier>[a-f0-9-]{32,36})/$', PersonDetailView.as_view(), name='facts-person-detail'),
    url(r'^people/$', PersonListView.as_view(), name='facts-person-list'),
    url(r'^organizations/(?P<slug>[-\w]+)/$', OrganizationDetailView.as_view(), name='facts-organization-detail'),
    url(r'^organizations/$', OrganizationListView.as_view(), name='facts-organization-list'),
    url(r'^companies/$', CompanyListView.as_view(), name='facts-company-list'),
    url(r'^financing-organizations/$', FinancingOrganizationListView.as_view(), name='facts-financingorganization-list'),
    url(r'^governments/$', GovernmentListView.as_view(), name='facts-government-list'),
    url(r'^militaries/$', MilitaryListView.as_view(), name='facts-military-list'),
    url(r'^multilaterals/$', MultilateralListView.as_view(), name='facts-multilateral-list'),
    url(r'^ngos/$', NGOListView.as_view(), name='facts-ngo-list'),
    url(r'^political-entities/$', PoliticalListView.as_view(), name='facts-political-list'),
    url(r'^events/(?P<slug>[-\w]+)/$', EventDetailView.as_view(), name='facts-event-detail'),
    url(r'^events/$', EventListView.as_view(), name='facts-event-list'),
]
