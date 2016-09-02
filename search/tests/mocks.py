from django.db import models
from elasticsearch_dsl import (
    DocType,
)
from search.base import ModelSerializer


class MockDocOne(DocType):
    pass


class MockDocTwo(DocType):
    pass


class MockDocThree(DocType):
    pass


class MockModel(models.Model):
    name = models.CharField(blank=True, max_length=100)


class MockModelThree(models.Model):
    name = models.CharField(blank=True, max_length=100)


class MockUnserializedModel(models.Model):
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
        model = MockModelThree
        doc_type = 'search.tests.mocks.MockDocThree'
        fields = ('name',)
