from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.views.generic.edit import FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.urlresolvers import reverse
from django.http import HttpResponseServerError

from tempfile import NamedTemporaryFile
from locations.utils import geostore_from_file
from .models import (Project, Initiative)
from .forms import ProjectGeoUploadForm

import logging
from django.conf import settings

MAPBOX_TOKEN = getattr(settings, 'MAPBOX_TOKEN', None)
MAPBOX_STYLE_URL = getattr(settings, 'MAPBOX_STYLE_URL', 'mapbox://styles/mapbox/streets-v8')
LEAFLET_CONFIG = getattr(settings, 'LEAFLET_CONFIG', None)
DEFAULT_CENTER = LEAFLET_CONFIG.get('DEFAULT_CENTER') if LEAFLET_CONFIG else None

logger = logging.getLogger(__name__)


class ProjectDetailView(DetailView):
    model = Project
    slug_field = 'identifier'
    slug_url_kwarg = 'identifier'

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
    slug_field = 'identifier'
    slug_url_kwarg = 'identifier'


class InitiativeListView(ListView):
    model = Initiative
    paginate_by = 50


# Project geom upload
class GeoUploadView(LoginRequiredMixin, FormView):
    template_name = 'infrastructure/admin/geo_upload_form.html'
    form_class = ProjectGeoUploadForm

    def form_valid(self, form):
        tempfp = NamedTemporaryFile(delete=False)
        uploaded_file = form.files['geo_file']
        tempfp.write(uploaded_file.read())
        tempfp.close()
        label = form.cleaned_data.get('label') or uploaded_file.name
        project = form.cleaned_data.get('project', None)
        try:
            geo = geostore_from_file(tempfp.name, label)
            if project:
                project.geo = geo
                project.save()
            self.success_url = reverse('admin:locations_geometrystore_change', args=(geo.id,))
            return super(GeoUploadView, self).form_valid(form)
        except Exception as e:
            err_msg = "Unable to create geodata from uploaded file!"
            logger.error(e)
            logger.error(err_msg)
            return HttpResponseServerError(err_msg)
