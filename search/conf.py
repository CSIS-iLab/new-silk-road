from django.db import models
from django.conf import settings
from elasticsearch_dsl import DocType
from collections import defaultdict
from importlib import import_module
from inspect import isclass
import logging
from search.utils import (
    split_class_path,
    get_document_class,
)

logger = logging.getLogger(__package__)

DEFAULT_SERIALIZER_PATH = 'search.serializers'


def get_serializer_model_label(serializer_class):
    model_label = None
    if isclass(serializer_class.Meta.model) and issubclass(serializer_class.Meta.model, models.Model):
        model_label = serializer_class.Meta.model._meta.label
    elif isinstance(serializer_class.Meta.model, str):
        model_label = serializer_class.Meta.model
    return model_label


def get_serializer_doctype_label(serializer_class):
    doc_type_label = None
    doc_type_ref = serializer_class.Meta.doc_type
    if isclass(doc_type_ref) and issubclass(doc_type_ref, DocType):
        doc_type_label = serializer_class.Meta.model._meta.label
    elif isinstance(doc_type_ref, str):
        doc_type_label = doc_type_ref
    return doc_type_label


class SearchConf:

    def __init__(self, serializers_path=None, auto_setup=False):
        self._serializers_path = serializers_path or DEFAULT_SERIALIZER_PATH
        self._model_serializers = {}
        self._doctype_lookup = defaultdict(set)
        self._serializer_module = None
        self._settings = None
        if auto_setup:
            self.setup()

    def setup(self, serializers_path=None):
        if serializers_path:
            self._serializers_path = serializers_path
        if self._serializers_path:
            self._serializer_module = import_module(self._serializers_path)
        self._settings = getattr(settings, 'SEARCH', {})
        for config in self._settings.values():
            self._configure(config.get('serializers', []), config.get('index'))

    def _configure(self, serializer_labels, index_name):
        for serializer_label in serializer_labels:
            serializer_mod_path, serializer_label = split_class_path(serializer_label)
            mod_path = serializer_mod_path or self._serializers_path
            mod = import_module(mod_path)
            serializer_class = getattr(mod, serializer_label, None)
            if serializer_class:
                self._register_serializer_model(serializer_class)
                self._configure_serializer_doctype(serializer_class, index_name)

    def _register_serializer_model(self, serializer_class):
        model_label = get_serializer_model_label(serializer_class)
        if not model_label:
            raise TypeError('Invalid model attribute on Meta class for {}'.format(repr(serializer_class)))
        self._model_serializers[model_label] = serializer_class

    def _configure_serializer_doctype(self, serializer_class, index_name):
        doc_type_label = get_serializer_doctype_label(serializer_class)
        if doc_type_label:
            self._doctype_lookup[index_name].add(doc_type_label)
            # register doc_type_class with index
            doc_type_class = get_document_class(doc_type_label)
            doc_type_class._doc_type.index = index_name
        else:
            logger.error("DocType not found for '{}'".format(repr(serializer_class)))

    def get_serializer_for_model(self, model):
        if isclass(model) and issubclass(model, models.Model):
            model = model._meta.label
        SerializerClass = self._model_serializers.get(model, None)
        if SerializerClass:
            return SerializerClass
        else:
            raise LookupError("Serializer not found for model '{}'".format(model))

    def get_doctypes_for_index(self, index_name):
        return tuple(self._doctype_lookup[index_name])

    def get_doctype_for_model(self, model):
        serializer_class = self.get_serializer_for_model(model)
        return serializer_class().doc_type

    def get_registered_models(self):
        return list(self._model_serializers.keys())
