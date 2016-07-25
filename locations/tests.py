from django.test import TestCase
from .models import PointGeometry
from django.contrib.gis.geos import Point
from django.utils.text import slugify
import factory


class CountryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'locations.Country'

    name = factory.Faker('country')
    slug = factory.LazyAttribute(lambda x: slugify(x.name))
    numeric = 4
    alpha_3 = 'AFG'


class PointGeometryTestCase(TestCase):

    def test_point_coordinates(self):
        x_coord = -79.033333
        y_coord = 35.933333
        obj = PointGeometry(label='Test Point', geom=Point(x_coord, y_coord))

        self.assertIsNotNone(obj.latitude)
        self.assertEqual(obj.latitude, y_coord)

        self.assertIsNotNone(obj.longitude)
        self.assertEqual(obj.longitude, x_coord)
