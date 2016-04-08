from django.conf.urls import url
from .views import PointsGeoJSONView, LinesGeoJSONView, PolygonsGeoJSONView

urlpatterns = [
    url(r'(?P<identifier>[a-f0-9-]{32,36})/points.geojson$', PointsGeoJSONView.as_view(), name='geostore-points'),
    url(r'(?P<identifier>[a-f0-9-]{32,36})/lines.geojson$', LinesGeoJSONView.as_view(), name='geostore-lines'),
    url(r'(?P<identifier>[a-f0-9-]{32,36})/polygons.geojson$', PolygonsGeoJSONView.as_view(), name='geostore-polygons'),
]
