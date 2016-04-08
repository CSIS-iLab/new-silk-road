from django.views.generic import View
from django.views.generic.detail import SingleObjectMixin
from django.core.serializers import serialize
from django.http import HttpResponse
from .models import GeometryStore


class BaseGeoJSONView(View):

    def get_geometry_objects(self):
        return None

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        self.geometry_objects = self.get_geometry_objects()
        return self.render_to_response()

    def render_to_response(self):
        resp = serialize(
            'geojson',
            self.geometry_objects.all(),
            geometry_field='geom'
        )
        return HttpResponse(resp, content_type="application/json")


class PointsGeoJSONView(SingleObjectMixin, BaseGeoJSONView):
    model = GeometryStore
    slug_field = 'identifier'
    slug_url_kwarg = 'identifier'

    def get_geometry_objects(self):
        return self.object.points.all()


class LinesGeoJSONView(SingleObjectMixin, BaseGeoJSONView):
    model = GeometryStore
    slug_field = 'identifier'
    slug_url_kwarg = 'identifier'

    def get_geometry_objects(self):
        return self.object.lines.all()


class PolygonsGeoJSONView(SingleObjectMixin, BaseGeoJSONView):
    model = GeometryStore
    slug_field = 'identifier'
    slug_url_kwarg = 'identifier'

    def get_geometry_objects(self):
        return self.object.polygons.all()
