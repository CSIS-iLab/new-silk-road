from django.db import models
from importlib import import_module
from inspect import isclass
from collections import defaultdict
import logging
from search.utils import get_document_class

logger = logging.getLogger(__package__)

DEFAULT_SERIALIZER_PATH = 'search.serializers'


class SearchRegistry:

    def __init__(self, serializers_path=None):
        self._doctypes = defaultdict(list)
        self._model_serializers = {}
        self._serializer_module = import_module(serializers_path or DEFAULT_SERIALIZER_PATH)

    def _register_serializer_model(self, serializer_class):
        model_label = None
        if isclass(serializer_class.Meta.model) and issubclass(serializer_class.Meta.model, models.Model):
            model_label = serializer_class.Meta.model._meta.label
        elif isinstance(serializer_class.Meta.model, str):
            model_label = serializer_class.Meta.model
        if not model_label:
            raise TypeError('Invalid model attribute on Meta class for {}'.format(repr(serializer_class)))
        self._model_serializers[model_label] = serializer_class

    def _register_serializer_doctype(self, serializer_class):
        doc_type = getattr(serializer_class.Meta, 'doc_type', None)
        if isinstance(doc_type, str):
            doc_type = get_document_class(doc_type)
        if doc_type:
            self._doctypes[doc_type._doc_type.index].append(doc_type)

    def _register_serializers(self, serializer_labels):
        for serializer_label in serializer_labels:
            serializer_class = getattr(self._serializer_module, serializer_label, None)
            if serializer_class:
                self._register_serializer_model(serializer_class)
                self._register_serializer_doctype(serializer_class)

    def register(self, serializer_labels):
        self._register_serializers(serializer_labels)

    def get_doctypes_for_index(self, index_name):
        return self._doctypes[index_name]

    def get_serializer_for_model(self, model):
        if isclass(model) and issubclass(model, models.Model):
            model = model._meta.label
        return self._model_serializers.get(model, None)
