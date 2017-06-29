import factory.fuzzy
import factory
import random

from django.contrib.gis.geos import Point

from .models import PointGeometry, Country


class FuzzyPoint(factory.fuzzy.BaseFuzzyAttribute):
    def fuzz(self):
        return Point(random.uniform(-180.0, 180.0),
                     random.uniform(-90.0, 90.0))


class PointGeometryFactory(factory.Factory):
    class Meta:
        model = PointGeometry

    geom = FuzzyPoint()


class CountryFactory(factory.Factory):
    class Meta:
        model = Country

    name = factory.Sequence(lambda n: 'Country %d' % n)
    slug = factory.Sequence(lambda n: 'Country-%d' % n)
    numeric = factory.Sequence(lambda n: n)
    alpha_3 = factory.Sequence(lambda n: str(n))
