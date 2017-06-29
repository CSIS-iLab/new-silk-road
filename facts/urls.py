from django.conf.urls import url

from .views import (
    PersonDetailView, PersonListView,
    EventDetailView, EventListView,

    OrganizationDetailView, OrganizationListView,
    OrganizationListRedirectView,
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
    url(r'^people/(?P<slug>\S+)/(?P<identifier>[a-f0-9-]{32,36})/$',
        PersonDetailView.as_view(), name='person-detail'),
    url(r'^people/$', PersonListView.as_view(), name='person-list'),
    url(r'^organizations/(?P<slug>\S+)/(?P<identifier>[a-f0-9-]{32,36})/$',
        OrganizationDetailView.as_view(), name='organization-detail'),
    url(r'^organizations/$', OrganizationListView.as_view(), name='organization-list'),
    url(r'^organizations-redirect/(?P<org_type>[a-z]+)/$',
        OrganizationListRedirectView.as_view(), name='organization-list-redirect'),
    url(r'^companies/$', CompanyListView.as_view(), name='companydetails-list'),
    url(r'^financing-organizations/$',
        FinancingOrganizationListView.as_view(), name='financingorganizationdetails-list'),
    url(r'^governments/$', GovernmentListView.as_view(), name='governmentdetails-list'),
    url(r'^militaries/$', MilitaryListView.as_view(), name='militarydetails-list'),
    url(r'^multilaterals/$', MultilateralListView.as_view(), name='multilateraldetails-list'),
    url(r'^ngos/$', NGOListView.as_view(), name='ngodetails-list'),
    url(r'^political-entities/$', PoliticalListView.as_view(), name='politicaldetails-list'),
    url(r'^events/(?P<slug>\S+)/$', EventDetailView.as_view(), name='event-detail'),
    url(r'^events/$', EventListView.as_view(), name='event-list'),
]
