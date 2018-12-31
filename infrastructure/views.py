import datetime
import logging
from tempfile import NamedTemporaryFile

from django.conf import settings
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.urlresolvers import reverse
from django.db import connection
from django.http import HttpResponseServerError, HttpResponse
from django.views.generic import TemplateView, View
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.views.generic.edit import FormView

from .models import PowerPlant, Project, Initiative
from .forms import ProjectGeoUploadForm
from locations.utils import geostore_from_file
from publish.views import PublicationMixin


MAPBOX_TOKEN = getattr(settings, 'MAPBOX_TOKEN', None)
MAPBOX_STYLE_URL = getattr(settings, 'MAPBOX_STYLE_URL', 'mapbox://styles/mapbox/streets-v8')

logger = logging.getLogger(__name__)


class ProjectDetailView(PublicationMixin, DetailView):
    model = Project
    slug_field = 'identifier'
    slug_url_kwarg = 'identifier'

    def get_context_data(self, **kwargs):
        context = super(ProjectDetailView, self).get_context_data(**kwargs)
        context['mapbox_token'] = MAPBOX_TOKEN
        context['mapbox_style'] = MAPBOX_STYLE_URL
        return context


class ProjectsMapView(TemplateView):
    template_name = 'infrastructure/megamap.html'

    def get_context_data(self, **kwargs):
        context = super(ProjectsMapView, self).get_context_data(**kwargs)
        context['mapbox_token'] = MAPBOX_TOKEN
        context['mapbox_style'] = MAPBOX_STYLE_URL
        return context


class ProjectListView(PublicationMixin, ListView):
    model = Project
    paginate_by = 50


class CountryProjectListView(ProjectListView):

    def get_queryset(self):
        self.queryset = super().get_queryset()
        country_identifier = self.kwargs.get('country_slug', None)
        if country_identifier:
            self.queryset = self.queryset.filter(countries__slug=country_identifier)
        return self.queryset


class InitiativeDetailView(PublicationMixin, DetailView):
    queryset = Initiative.publishable_objects.all()
    slug_field = 'identifier'
    slug_url_kwarg = 'identifier'


class InitiativeListView(PublicationMixin, ListView):
    queryset = Initiative.publishable_objects.all()
    ordering = ['name']
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
            logger.error(e)
            err_msg = "Unable to create geodata from uploaded file!"
            error_response = '<h1>{}</h1><p>{}</p>'.format(err_msg, str(e))
            return HttpResponseServerError(error_response)


class ProjectExportView(View):

    def get(self, request, *args, **kwargs):
        response = HttpResponse(content_type='text/csv')
        d = datetime.datetime.now()
        filename = "infrastructure_projects_{:%Y%m%d_%H%M}.csv".format(d)
        response['Content-Disposition'] = 'attachment; filename="{}"'.format(filename)
        with connection.cursor() as cursor:
            cursor.copy_expert(
                '''
                COPY (SELECT * FROM infrastructure_projects_export_view)
                TO STDOUT
                WITH (FORMAT csv, HEADER TRUE, NULL 'NULL', FORCE_QUOTE *)''',
                response
            )
        return response


class PowerPlantDetailView(PublicationMixin, DetailView):
    model = PowerPlant
    template_name = 'infrastructure/powerplant_detail.html'

    def get_context_data(self, **kwargs):
        context = super(PowerPlantDetailView, self).get_context_data(**kwargs)
        context['mapbox_token'] = MAPBOX_TOKEN
        context['mapbox_style'] = MAPBOX_STYLE_URL
        context['initiatives'] = Initiative.objects.filter(project__power_plant_id=self.object.pk,
                          project__published=True).distinct()
        return context
