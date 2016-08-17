from django.apps import apps
from django.db import models
from django.forms.models import model_to_dict
from search.utils import doc_id_for_instance


class ModelSerializer:
    class Meta:
        model = None
        fields = None
        doc_type = None

    def __init__(self):
        if not self.Meta.model:
            raise Exception('You must set a Meta class with a model attribute with a model label or class')
        if not self.Meta.fields:
            raise Exception('You must set a Meta class with a fields attribute with an iterable of field names')
        if not self.Meta.doc_type:
            raise Exception('You must set a Meta class with a doc_type attribute with a DocType model')

        self.model_class = apps.get_model(self.Meta.model) if isinstance(self.Meta.model, str) else self.Meta.model
        if not issubclass(self.model_class, models.Model):
            raise TypeError('model attribute must be a django Model subclass')

        self._fields = set(self.Meta.fields)
        self._simple_fields = []
        self._choice_fields = []
        self._relfields = []

        for field_name in self._fields:
            field = self.model_class._meta.get_field(field_name)
            if hasattr(self, field_name):
                # Use attribute definition to serialize
                if field.is_relation:
                    self._relfields.append(field_name)
            else:
                if field.is_relation:
                    raise AttributeError('If you supply the name of a relational (fk, m2m) field, you must also provide an attribute to define the mapping')
                if field.choices:
                    self._choice_fields.append(field_name)
                else:
                    self._simple_fields.append(field_name)

    def serialize(self, instance):
        if not isinstance(instance, self.model_class):
            raise TypeError('Instance must match model class')

        obj_dict = model_to_dict(instance, fields=self._simple_fields)
        obj_dict['_app'] = {'label': instance._meta.label, 'id': instance.id}
        obj_dict['_id'] = doc_id_for_instance(instance)

        for f in self._relfields:
            rel_map = getattr(self, f)
            rel_value = getattr(instance, f, None)
            if rel_value:
                obj_dict[f] = rel_map.serialize(rel_value.all() if rel_map.many else rel_value)

        for f in self._choice_fields:
            get_display_value = getattr(instance, 'get_{}_display'.format(f), None)
            if get_display_value:
                obj_dict[f] = get_display_value()

        return obj_dict

    @property
    def doc_type(self):
        return self.Meta.doc_type

    def create_document(self, instance):
        obj_dict = self.serialize(instance)
        return self.doc_type(**obj_dict)


class RelatedSerializer:

    def __init__(self, mapping_class, many=False):
        if not issubclass(mapping_class, ModelSerializer):
            raise TypeError('RelatedSerializer requires a ModelSerializer subclass as the first argument')
        self.serializer = mapping_class()
        self.many = many

    def serialize(self, instance):
        if self.many:
            if isinstance(instance, models.Model):
                instance = [instance]
            return [self.serializer.serialize(item) for item in instance]
        else:
            return self.serializer.serialize(instance)
