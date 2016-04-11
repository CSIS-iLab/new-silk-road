from django.views.generic import View
from django.views.generic.detail import SingleObjectMixin
from django.core.serializers import serialize
from django.http import HttpResponse, Http404
from .models import GeometryStore


class GeoJSONResponseMixin(object):

    def render_to_response(self, geo_objects):
        if not geo_objects:
            raise Http404("GeoJSON not found")
        resp = serialize(
            'geojson',
            geo_objects,
            geometry_field='geom',
            fields=('label',)
        )
        return HttpResponse(resp, content_type="application/json")


class BaseGeoJSONView(View, GeoJSONResponseMixin):
    geo_queryset = None

    def get_geo_queryset(self):
        if self.geo_queryset:
            return self.geo_queryset
        return None

    def get(self, request, *args, **kwargs):
        self.geo_queryset = self.get_geo_queryset()
        return self.render_to_response(self.geo_queryset)


class PointsGeoJSONView(SingleObjectMixin, BaseGeoJSONView):
    model = GeometryStore
    slug_field = 'identifier'
    slug_url_kwarg = 'identifier'

    def get_geo_queryset(self):
        self.object = self.get_object()
        return self.object.points.all()


class LinesGeoJSONView(SingleObjectMixin, BaseGeoJSONView):
    model = GeometryStore
    slug_field = 'identifier'
    slug_url_kwarg = 'identifier'

    def get_geo_queryset(self):
        self.object = self.get_object()
        return self.object.lines.all()


class PolygonsGeoJSONView(SingleObjectMixin, BaseGeoJSONView):
    model = GeometryStore
    slug_field = 'identifier'
    slug_url_kwarg = 'identifier'

    def get_geo_queryset(self):
        self.object = self.get_object()
        return self.object.polygons.all()
