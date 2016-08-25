from django.apps import apps
from django.core.exceptions import ObjectDoesNotExist
from django_rq import job
import logging

logger = logging.getLogger(__package__)

search_config = apps.get_app_config(__package__)


@job
def handle_model_post_save(label, pk):
    logger.debug('handle_model_post_save called with ({}, {})'.format(label, pk))
    save_to_search_index.delay(label, pk)


@job
def save_to_search_index(label, pk):
    logger.debug('save_model_to_search_index called with ({}, {})'.format(label, pk))
    try:
        Model = apps.get_model(label)
        try:
            instance = Model.objects.get(id=pk)
            should_be_searchable = getattr(instance, 'published', True)
            logger.info('handle_model_post_save for model {}'.format(label))
            if should_be_searchable:
                SerializerClass = search_config.registry.get_serializer_for_model(label)
                serializer = SerializerClass()
                doc = serializer.create_document(instance)
                result = doc.save()
                logger.info("save_model_to_search_index success: '{}'".format(str(result)))
            else:
                remove_from_search_index(label, pk)
        except ObjectDoesNotExist as e:
            logger.error(e)
    except LookupError as e:
        logger.error(e)


@job
def remove_from_search_index(label, pk):
    pass
