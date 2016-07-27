from elasticsearch_dsl import (
    DocType, String, Date, Boolean,
    Nested, InnerObjectWrapper
)


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
    regions = String()
    infrastructure_type = Nested(doc_class=InfrastructureTypeDoc, properties={'name': String()})

    class Meta:
        index = 'blog'
