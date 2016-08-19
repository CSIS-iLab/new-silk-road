from elasticsearch_dsl import (
    DocType, String, Date,
    Nested, InnerObjectWrapper,
)
from search import DEFAULT_INDEX


class CategoryDoc(InnerObjectWrapper):
    name = String()


class CountryDoc(InnerObjectWrapper):
    name = String()


class InfrastructureTypeDoc(InnerObjectWrapper):
    name = String()


class ProjectDoc(DocType):
    identifier = String()
    name = String()
    alternate_name = String()
    description = String()
    countries = Nested(doc_class=CountryDoc, properties={'name': String()})
    infrastructure_type = Nested(doc_class=InfrastructureTypeDoc, properties={'name': String()})

    class Meta:
        index = DEFAULT_INDEX


class EntryDoc(DocType):
    title = String()
    author = String()
    content = String()
    description = String()
    publication_date = Date()
    categories = Nested(doc_class=CategoryDoc, properties={'name': String()})

    class Meta:
        index = DEFAULT_INDEX
