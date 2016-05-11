from django.conf.urls import url
from django.contrib.admin.views.decorators import staff_member_required

from .views import (
    ProjectDetailView, ProjectListView,
    InitiativeDetailView, InitiativeListView,
    GeoUploadView
)

adminpatterns = [
    url(r'^add-geo/$', staff_member_required()(GeoUploadView.as_view()), name='project-geo-upload')
]

app_name = 'infrastructure'
urlpatterns = [
    url(r'^projects/(?P<slug>\S+)/(?P<identifier>[a-f0-9-]{32,36})/$', ProjectDetailView.as_view(), name='project-detail'),
    url(r'^projects/$', ProjectListView.as_view(), name='project-list'),
    url(r'^initiatives/(?P<slug>\S+)/(?P<identifier>[a-f0-9-]{32,36})/$', InitiativeDetailView.as_view(), name='initiative-detail'),
    url(r'^initiatives/$', InitiativeListView.as_view(), name='initiative-list'),
]
