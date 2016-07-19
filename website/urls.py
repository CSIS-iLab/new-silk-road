from django.conf.urls import include, url

from .views import (
    HomeView,
    DatabaseView,
    CompetingVisionsView,
)
from infrastructure.views import (
    ProjectsMapView,
)
from .feeds import LatestEntriesFeed


urlpatterns = [
    url(r'^$', HomeView.as_view(), name='website-home'),
    url(r'^analysis/competing-visions/$', CompetingVisionsView.as_view()),
    url(r'^analysis/feed/$', LatestEntriesFeed()),
    url(r'^analysis/', include('writings.urls')),
    url(r'^database/$', DatabaseView.as_view(), name='database-home'),
    url(r'^database/', include('infrastructure.urls')),
    url(r'^database/', include('facts.urls')),
    url(r'^map/$', ProjectsMapView.as_view(), name='website-map'),
]
