import factory.fuzzy
import factory
import random

from django.contrib.gis.geos import Point

from .models import PointGeometry, GeometryStore


class FuzzyPoint(factory.fuzzy.BaseFuzzyAttribute):
    def fuzz(self):
        return Point(random.uniform(-180.0, 180.0),
                     random.uniform(-90.0, 90.0))


class PointGeometryFactory(factory.Factory):
    class Meta:
        model = PointGeometry

    geom = FuzzyPoint()


# class GeometryStoreFactory(factory.Factory):
#     class Meta:
#         model = GeometryStore
#
#     points = factory.SubFactory(PointGeometryFactory)
