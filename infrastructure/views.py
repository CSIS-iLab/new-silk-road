from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from locations.views import BaseGeoJSONView
from locations.models import (
    LineStringGeometry,
    PointGeometry,
    PolygonGeometry,
)

from .models import (Project, Initiative)
from django.conf import settings

MAPBOX_TOKEN = getattr(settings, 'MAPBOX_TOKEN', None)
LEAFLET_CONFIG = getattr(settings, 'LEAFLET_CONFIG', None)
DEFAULT_CENTER = LEAFLET_CONFIG.get('DEFAULT_CENTER') if LEAFLET_CONFIG else None


class ProjectDetailView(DetailView):
    model = Project

    def get_context_data(self, **kwargs):
        context = super(ProjectDetailView, self).get_context_data(**kwargs)
        context['mapbox_token'] = MAPBOX_TOKEN
        return context


class ProjectsMapView(ListView):
    model = Project
    template_name = 'infrastructure/all_projects_map.html'

    def get_context_data(self, **kwargs):
        context = super(ProjectsMapView, self).get_context_data(**kwargs)
        context['mapbox_token'] = MAPBOX_TOKEN
        return context


class ProjectsPointsGeoJSONView(BaseGeoJSONView):
    geo_queryset = PointGeometry.objects.filter(geometrystore__project__isnull=False).all()


class ProjectsLinesGeoJSONView(BaseGeoJSONView):
    geo_queryset = LineStringGeometry.objects.filter(geometrystore__project__isnull=False).all()


class ProjectsPolygonsGeoJSONView(BaseGeoJSONView):
    geo_queryset = PolygonGeometry.objects.filter(geometrystore__project__isnull=False).all()


class ProjectListView(ListView):
    model = Project
    paginate_by = 50


class InitiativeDetailView(DetailView):
    model = Initiative


class InitiativeListView(ListView):
    model = Initiative
    paginate_by = 50
