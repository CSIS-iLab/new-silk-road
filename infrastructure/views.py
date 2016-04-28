from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.views.generic.edit import FormView
from django.contrib.auth.mixins import LoginRequiredMixin

from .models import (Project, Initiative)
from .forms import ProjectGeoUploadForm
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


# Project geom upload
class GeoUploadView(LoginRequiredMixin, FormView):
    template_name = 'infrastructure/admin/geo_upload_form.html'
    form_class = ProjectGeoUploadForm
    success_url = '/thanks/'

    def form_valid(self, form):
        # This method is called when valid form data has been POSTed.
        # It should return an HttpResponse.
        # form.send_email()
        print("FORM")
        return super(GeoUploadView, self).form_valid(form)
