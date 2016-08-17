from elasticsearch_dsl import Index
from importlib import import_module


def get_document_class(doctype_path):
    module_path, class_name = doctype_path.rsplit('.', maxsplit=1)
    if len(module_path.split('.')) == 1:
        module_path = module_path + '.documents'
    module = import_module(module_path)
    return getattr(module, class_name, None)


def create_search_index(index_name, doc_types=None, connection='default'):
    index = Index(index_name, using=connection)
    if doc_types:
        for dt in doc_types:
            if isinstance(dt, str):
                dt = get_document_class(dt)
            index.doc_type(dt)
    if not index.exists():
        index.create()
    return index


def doc_id_for_instance(instance):
    return '-'.join((instance._meta.label, str(instance.id)))
