from django.db import models
from django.conf import settings
from elasticsearch_dsl import Index
from importlib import import_module
from inspect import isclass
import logging
from search.utils import get_document_class

logger = logging.getLogger(__package__)

DEFAULT_SERIALIZER_PATH = 'search.serializers'


class SearchRegistry:

    def __init__(self, serializers_path=None):
        self._model_serializers = {}
        self._serializer_module = import_module(serializers_path or DEFAULT_SERIALIZER_PATH)
        self._settings = getattr(settings, 'SEARCH', {})

        self._doctype_lookup = {value['index']: value['doc_types'] for key, value in self._settings.items()}

    def _register_serializer_model(self, serializer_class):
        model_label = None
        if isclass(serializer_class.Meta.model) and issubclass(serializer_class.Meta.model, models.Model):
            model_label = serializer_class.Meta.model._meta.label
        elif isinstance(serializer_class.Meta.model, str):
            model_label = serializer_class.Meta.model
        if not model_label:
            raise TypeError('Invalid model attribute on Meta class for {}'.format(repr(serializer_class)))
        self._model_serializers[model_label] = serializer_class

    def _register_serializers(self, serializer_labels):
        for serializer_label in serializer_labels:
            serializer_class = getattr(self._serializer_module, serializer_label, None)
            if serializer_class:
                self._register_serializer_model(serializer_class)

    def register(self, serializer_labels):
        self._register_serializers(serializer_labels)

    def get_serializer_for_model(self, model):
        if isclass(model) and issubclass(model, models.Model):
            model = model._meta.label
        return self._model_serializers.get(model, None)

    def get_doctype_for_model(self, model):
        serializer_class = self.get_serializer_for_model(model)
        return serializer_class().doc_type

    def get_registered_models(self):
        return list(self._model_serializers.keys())

    def configure_doctypes(self):
        for name, doctypes in self._doctype_lookup.items():
            index = Index(name)
            if index.exists():
                for value in doctypes:
                    DocType = get_document_class(value)
                    if DocType:
                        index.doc_type(DocType)
                    else:
                        logger.error("DocType not found for '{}'".format(value))

            else:
                logger.warn("Index '{}' does not exist".format(name))
