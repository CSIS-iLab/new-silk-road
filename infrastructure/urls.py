from django.conf.urls import url
from django.contrib.admin.views.decorators import staff_member_required

from .views import (
    ProjectDetailView, ProjectListView,
    CountryProjectListView,
    InitiativeDetailView, InitiativeListView,
    GeoUploadView, ProjectExportView, PowerPlantExportView,
    PowerPlantDetailView
)


app_name = 'infrastructure'
adminpatterns = ([
    url(r'^add-geo/$', staff_member_required()(GeoUploadView.as_view()), 
    name='project-geo-upload'),
    url(r'^export-projects/csv/$', staff_member_required()(ProjectExportView.as_view()), 
    name='projects-export-view'),
    url(r'^export-powerplants/csv/$', staff_member_required()(PowerPlantExportView.as_view()),
    name='powerplants-export-view'),
], app_name)

urlpatterns = [
    url(r'^country/(?P<country_slug>\S+)/projects/$', CountryProjectListView.as_view(), name='country-project-list'),
    url(r'^projects/(?P<slug>\S+)/(?P<identifier>[a-f0-9-]{32,36})/$', ProjectDetailView.as_view(), name='project-detail'),
    url(r'^powerplants/(?P<slug>\S+)/$', PowerPlantDetailView.as_view(), name='powerplant-detail'),
    url(r'^projects/$', ProjectListView.as_view(), name='project-list'),
    url(r'^initiatives/(?P<slug>\S+)/(?P<identifier>[a-f0-9-]{32,36})/$', InitiativeDetailView.as_view(), name='initiative-detail'),
    url(r'^initiatives/$', InitiativeListView.as_view(), name='initiative-list'),
]
