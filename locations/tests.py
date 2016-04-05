from django.test import TestCase
from .models import PointGeometry
from django.contrib.gis.geos import Point


class PointGeometryTestCase(TestCase):

    def test_point_coordinates(self):
        x_coord = -79.033333
        y_coord = 35.933333
        obj = PointGeometry(label='Test Point', geometry=Point(x_coord, y_coord))

        self.assertIsNotNone(obj.latitude)
        self.assertEqual(obj.latitude, y_coord)

        self.assertIsNotNone(obj.longitude)
        self.assertEqual(obj.longitude, x_coord)
