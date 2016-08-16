from django.apps import apps
from django.db.models.signals import post_save, post_delete
from search.base import ModelMapping
import logging

logger = logging.getLogger(__name__)


def make_elasticsearch_save_receiver(mapping_class, **kwargs):

    def inner_func(sender, instance, created, raw, using, update_fields, *args, **kwargs):
        mapper = mapping_class()
        doc = mapper.to_doc(instance)
        doc.save()
        logger.info('Saved doc {} to Elasticsearch'.format(doc.id))
    return inner_func


def make_elasticsearch_delete_receiver(mapping_class, **kwargs):

    def inner_func(sender, instance, using, *args, **kwargs):
        mapper = mapping_class()
        doc = mapper.Meta.doc_type.get(id=instance.id)
        doc.delete()
        logger.info('Deleted doc {} to Elasticsearch'.format(instance.id))
    return inner_func


def connect_elasticsearch_signals(app_map):
    for label, mapping in app_map.items():
        try:
            if not issubclass(mapping, ModelMapping):
                logger.warn('"{}" is not a subclass of ModelMapping'.format(mapping))
        except Exception as e:
                logger.warn("connect_elasticsearch_signals encountered an error: {}".format(e))
                continue

        Model = apps.get_model(label)
        post_save.connect(
            make_elasticsearch_save_receiver(mapping),
            sender=Model,
            dispatch_uid="{}::save_elasticsearch".format(label)
        )
        post_delete.connect(
            make_elasticsearch_delete_receiver(mapping),
            sender=Model,
            dispatch_uid="{}::delete_elasticsearch".format(label)
        )
