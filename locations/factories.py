import factory

from .models import GeometryStore


class GeometryStoreFactory(factory.Factory):
    class Meta:
        model = GeometryStore

