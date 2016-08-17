from django.apps import apps
from django.db.models.signals import post_save, post_delete
from search.base import ModelSerializer
import logging

logger = logging.getLogger(__name__)


def make_elasticsearch_save_receiver(serializer_class, **kwargs):

    def inner_func(sender, instance, created, raw, using, update_fields, *args, **kwargs):
        serializer = serializer_class()
        doc = serializer.create_document(instance)
        doc.save()
        logger.info('Saved doc {} to Elasticsearch'.format(doc.id))
    return inner_func


def make_elasticsearch_delete_receiver(serializer_class, **kwargs):

    def inner_func(sender, instance, using, *args, **kwargs):
        serializer = serializer_class()
        doc = serializer.get_document(id=instance.id)
        doc.delete()
        logger.info('Deleted doc {} from Elasticsearch'.format(instance.id))
    return inner_func


def connect_elasticsearch_signals(app_map):
    for label, serializer in app_map.items():
        try:
            if not issubclass(serializer, ModelSerializer):
                logger.warn('"{}" is not a subclass of ModelSerializer'.format(serializer))
        except Exception as e:
                logger.warn("connect_elasticsearch_signals encountered an error: {}".format(e))
                continue

        Model = apps.get_model(label)
        post_save.connect(
            make_elasticsearch_save_receiver(serializer),
            sender=Model,
            dispatch_uid="{}::save_elasticsearch".format(label)
        )
        post_delete.connect(
            make_elasticsearch_delete_receiver(serializer),
            sender=Model,
            dispatch_uid="{}::delete_elasticsearch".format(label)
        )
