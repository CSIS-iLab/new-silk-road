from django.db import models
from elasticsearch_dsl import (
    DocType,
)


class MockDocType(DocType):

    class Meta:
        index = 'testindex'


class MockModel(models.Model):
    pass


class MockSerializer:
    class Meta:
        model = 'search.MockModel'
        doc_type = 'search.tests.mocks.MockDocType'
        fields = None


class MockSerializerTwo:
    class Meta:
        model = 'search.MockModelTwo'
        doc_type = 'search.tests.mocks.MockDocType'
        fields = None
