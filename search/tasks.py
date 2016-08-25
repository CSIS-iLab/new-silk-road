from django.apps import apps
from django.core.exceptions import ObjectDoesNotExist
from django_rq import job
from .utils import calculate_doc_id
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
                doc.save()
                logger.info("save_model_to_search_index SAVE: '{}'".format(instance.id))
            else:
                remove_from_search_index(label, pk)
        except ObjectDoesNotExist as e:
            logger.error(e)
    except LookupError as e:
        logger.error(e)


@job
def handle_model_post_delete(label, pk):
    logger.debug('handle_model_post_save called with ({}, {})'.format(label, pk))
    remove_from_search_index.delay(label, pk)


@job
def remove_from_search_index(label, pk, raise_on_404=False):
    DocType = search_config.registry.get_doctype_for_model(label)
    if DocType:
        doc_id = calculate_doc_id(label, pk)
        try:
            doc_obj = DocType.get(doc_id)
            doc_obj.delete()
        except Exception as e:
            logger.warn("Unable to find document with id='{}'. Unable to remove from search index".format(doc_id))
            if raise_on_404:
                raise e

    else:
        logger.error("Unable to find matching DocType for '{}'. Unable to remove from search index".format(label))
