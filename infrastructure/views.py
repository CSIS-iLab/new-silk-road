from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from djgeojson.views import GeoJSONLayerView

from .models import (Project, Initiative)
from locations.models import (MultiGeometry)


class ProjectDetailView(DetailView):
    model = Project


class ProjectsGeoJSONView(GeoJSONLayerView):
    queryset = MultiGeometry.objects.filter(project__isnull=True)
    geometry_field = 'geometry'
    properties = [
        'label',
        'attributes'
    ]


class ProjectsMapView(ListView):
    model = Project
    template_name = 'infrastructure/all_projects_map.html'


class ProjectListView(ListView):
    model = Project
    paginate_by = 50


class InitiativeDetailView(DetailView):
    model = Initiative


class InitiativeListView(ListView):
    model = Initiative
    paginate_by = 50
