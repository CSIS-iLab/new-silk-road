from django.db import models
from elasticsearch_dsl import (
    DocType,
)
from search.base import ModelSerializer
from .settings import TEST_SEARCH


class MockDocOne(DocType):

    class Meta:
        index = TEST_SEARCH['default']['index']


class MockDocTwo(DocType):

    class Meta:
        index = TEST_SEARCH['default']['index']


class MockModel(models.Model):
    name = models.CharField(blank=True, max_length=100)


class MockSerializer(ModelSerializer):
    class Meta:
        model = 'search.MockModel'
        doc_type = 'search.tests.mocks.MockDocOne'
        fields = ('name',)


class MockSerializerTwo(ModelSerializer):
    class Meta:
        model = 'search.MockModelTwo'
        doc_type = 'search.tests.mocks.MockDocTwo'
        fields = ('name',)


class MockSerializerThree(ModelSerializer):
    class Meta:
        model = MockModel
        doc_type = 'search.tests.mocks.MockDocOne'
        fields = ('name',)
