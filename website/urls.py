from django.conf.urls import include, url

from .views import (
    HomeView,
    DatabaseView,
)
from infrastructure.views import (
    ProjectsMapView,
)


urlpatterns = [
    url(r'^$', HomeView.as_view(), name='website-home'),
    url(r'^database/$', DatabaseView.as_view(), name='database-home'),
    url(r'^database/', include('infrastructure.urls')),
    url(r'^database/', include('facts.urls')),
    url(r'^map/$', ProjectsMapView.as_view(), name='website-map'),
]
