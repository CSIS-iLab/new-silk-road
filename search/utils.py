from elasticsearch_dsl import Index


def create_search_index(index_name, doc_types, connection='default'):
    index = Index(index_name, using=connection)
    for dt in doc_types:
        index.doc_type(dt)
    if not index.exists():
        index.create()
    return index
