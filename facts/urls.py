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

app_name = 'facts'
urlpatterns = [
    url(r'^people/(?P<identifier>[a-f0-9-]{32,36})/$', PersonDetailView.as_view(), name='person-detail'),
    url(r'^people/$', PersonListView.as_view(), name='person-list'),
    url(r'^organizations/(?P<slug>\S+)/$', OrganizationDetailView.as_view(), name='organization-detail'),
    url(r'^organizations/$', OrganizationListView.as_view(), name='organization-list'),
    url(r'^companies/$', CompanyListView.as_view(), name='company-list'),
    url(r'^financing-organizations/$', FinancingOrganizationListView.as_view(), name='financingorganization-list'),
    url(r'^governments/$', GovernmentListView.as_view(), name='government-list'),
    url(r'^militaries/$', MilitaryListView.as_view(), name='military-list'),
    url(r'^multilaterals/$', MultilateralListView.as_view(), name='multilateral-list'),
    url(r'^ngos/$', NGOListView.as_view(), name='ngo-list'),
    url(r'^political-entities/$', PoliticalListView.as_view(), name='political-list'),
    url(r'^events/(?P<slug>\S+)/$', EventDetailView.as_view(), name='event-detail'),
    url(r'^events/$', EventListView.as_view(), name='event-list'),
]
