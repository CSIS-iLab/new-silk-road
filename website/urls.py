from django.conf.urls import include, url
from django.contrib.flatpages import views

from .views import (
    HomeView,
    DatabaseView,
)
from infrastructure.views import (
    ProjectsMapView,
)
from .feeds import LatestEntriesFeed


urlpatterns = [
    url(r'^$', HomeView.as_view(), name='website-home'),
    url(r'^about/$', views.flatpage, {'url': '/about/'}, name='about'),
    url(r'^glossary/$', views.flatpage, {'url': '/glossary'}, name='glossary'),
    url(r'^methodology/$', views.flatpage, {'url': '/methodology'}, name='methodology'),
    url(r'^analysis/historical-atlas/$', views.flatpage, {'url': '/analysis/historical-atlas/'}, name='historical-atlas'),
    url(r'^analysis/competing-visions/$', views.flatpage, {'url': '/analysis/competing-visions/'}, name='competing-visions'),
    url(r'^analysis/historical-atlas/$', views.flatpage, {'url': '/analysis/historical-atlas/'}, name='historical-atlas'),
    url(r'^analysis/feed/$', LatestEntriesFeed()),
    url(r'^analysis/', include('writings.urls')),
    url(r'^database/$', DatabaseView.as_view(), name='database-home'),
    url(r'^database/', include('infrastructure.urls')),
    url(r'^database/', include('facts.urls')),
    url(r'^map/$', ProjectsMapView.as_view(), name='website-map'),
]
