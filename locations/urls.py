from django.conf.urls import url
from .views import PointsGeoJSONView, LinesGeoJSONView, PolygonsGeoJSONView

urlpatterns = [
    url(r'(?P<identifier>[a-f0-9-]{32,36})/points.json$', PointsGeoJSONView.as_view(), name='geostore-points'),
    url(r'(?P<identifier>[a-f0-9-]{32,36})/lines.json$', LinesGeoJSONView.as_view(), name='geostore-lines'),
    url(r'(?P<identifier>[a-f0-9-]{32,36})/polygons.json$', PolygonsGeoJSONView.as_view(), name='geostore-polygons'),
]
