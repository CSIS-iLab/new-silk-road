from importlib import import_module

DOC_ID_SEPARATOR = '::'

FACET_NAME_TRANSLATOR = str.maketrans({
    '_': ' ',
    ':': ': ',
    '.': ' ',
})


def split_class_path(class_path):
    parts = class_path.rsplit('.', maxsplit=1)
    if len(parts) == 1:
        return (None, parts[0])
    return tuple(parts)


def get_document_class(doctype_path):
    module_path, class_name = split_class_path(doctype_path)
    if not module_path:
        return None
    if len(module_path.split('.')) == 1:
        module_path = module_path + '.documents'
    module = import_module(module_path)
    return getattr(module, class_name, None)


def calculate_doc_id(label, pk):
    return ''.join((label, DOC_ID_SEPARATOR, str(pk)))


def doc_id_for_instance(instance):
    return calculate_doc_id(instance._meta.label, str(instance.id))
