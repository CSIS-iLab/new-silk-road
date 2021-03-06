import factory.fuzzy
import factory
import random

from django.contrib.gis.geos import Point


class FuzzyPoint(factory.fuzzy.BaseFuzzyAttribute):
    def fuzz(self):
        return Point(random.uniform(-180.0, 180.0),
                     random.uniform(-90.0, 90.0))


class PointGeometryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'locations.PointGeometry'

    geom = FuzzyPoint()


class CountryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'locations.Country'

    name = factory.Sequence(lambda n: 'Country %d' % n)
    slug = factory.Sequence(lambda n: 'Country-%d' % n)
    numeric = factory.Sequence(lambda n: n)
    alpha_3 = factory.Sequence(lambda n: str(n))


class RegionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'locations.Region'

    name = factory.Sequence(lambda n: 'Region %d' % n)
