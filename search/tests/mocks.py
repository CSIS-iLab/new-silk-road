from django.db import models
from elasticsearch_dsl import (
    DocType,
)
from search.base import ModelSerializer


class MockDocType(DocType):

    class Meta:
        index = 'testindex'


class MockModel(models.Model):
    name = models.CharField(blank=True, max_length=100)


class MockSerializer(ModelSerializer):
    class Meta:
        model = 'search.MockModel'
        doc_type = 'search.tests.mocks.MockDocType'
        fields = ('name',)


class MockSerializerTwo(ModelSerializer):
    class Meta:
        model = 'search.MockModelTwo'
        doc_type = 'search.tests.mocks.MockDocType'
        fields = ('name',)


class MockSerializerThree(ModelSerializer):
    class Meta:
        model = MockModel
        doc_type = 'search.tests.mocks.MockDocType'
        fields = ('name',)
