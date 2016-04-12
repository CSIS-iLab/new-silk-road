from django.conf.urls import url, include
from rest_framework import routers

from .views import HomeView
from infrastructure.views import (
    ProjectsMapView,
    ProjectViewSet, InitiativeViewSet,
)

router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'initiatives', InitiativeViewSet)


urlpatterns = [
    url(r'^$', HomeView.as_view(), name='website-home'),
    url(r'^map/$', ProjectsMapView.as_view(), name='website-map'),
    url(r'^api/', include(router.urls)),
]
