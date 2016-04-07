from django.conf.urls import url

from .views import HomeView
from infrastructure.views import ProjectsMapView

urlpatterns = [
    url(r'^$', HomeView.as_view(), name='website-home'),
    url(r'^map/$', ProjectsMapView.as_view(), name='website-map'),
]
