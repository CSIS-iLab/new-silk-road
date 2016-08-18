from elasticsearch_dsl import (
    DocType,
)


class FakeDocType(DocType):

    class Meta:
        index = 'testindex'


class FakeSerializer:
    class Meta:
        model = 'search.tests.Foo'
        doc_type = 'search.tests.mocks.FakeDocType'
        fields = None


class FakeSerializerTwo:
    class Meta:
        model = 'search.tests.FooTwo'
        doc_type = 'search.tests.mocks.FakeDocType'
        fields = None
