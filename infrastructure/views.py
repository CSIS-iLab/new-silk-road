from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from .models import (Project, Initiative)
from django.conf import settings

MAPBOX_TOKEN = getattr(settings, 'MAPBOX_TOKEN', None)
MAPBOX_STYLE_URL = getattr(settings, 'MAPBOX_STYLE_URL', 'mapbox://styles/mapbox/streets-v8')
LEAFLET_CONFIG = getattr(settings, 'LEAFLET_CONFIG', None)
DEFAULT_CENTER = LEAFLET_CONFIG.get('DEFAULT_CENTER') if LEAFLET_CONFIG else None


class ProjectDetailView(DetailView):
    model = Project

    def get_context_data(self, **kwargs):
        context = super(ProjectDetailView, self).get_context_data(**kwargs)
        context['mapbox_token'] = MAPBOX_TOKEN
        context['mapbox_style'] = MAPBOX_STYLE_URL
        return context


class ProjectsMapView(ListView):
    model = Project
    template_name = 'infrastructure/all_projects_map.html'

    def get_context_data(self, **kwargs):
        context = super(ProjectsMapView, self).get_context_data(**kwargs)
        context['mapbox_token'] = MAPBOX_TOKEN
        context['mapbox_style'] = MAPBOX_STYLE_URL
        return context


class ProjectListView(ListView):
    model = Project
    paginate_by = 50


class InitiativeDetailView(DetailView):
    model = Initiative


class InitiativeListView(ListView):
    model = Initiative
    paginate_by = 50
