from django.apps import apps
from django.core.exceptions import ObjectDoesNotExist
from django.utils.timezone import get_default_timezone
from elasticsearch_dsl import Index
from elasticsearch_dsl.connections import connections
from elasticsearch.helpers import bulk as es_bulk
import django_rq
from .utils import calculate_doc_id, get_document_class
from .conf import SearchConf
from functools import partial
import datetime
from pytz import utc
import logging

logger = logging.getLogger(__package__)

search_config = SearchConf(auto_setup=True)


def create_search_index(index_name, doc_types=None, connection='default', delete_if_exists=False):
    index = Index(index_name, using=connection)
    if delete_if_exists:
        index.delete(ignore=404)
    if doc_types:
        for dt in doc_types:
            if isinstance(dt, str):
                dt = get_document_class(dt)
            index.doc_type(dt)
    if not index.exists():
        index.create()
    return index


def handle_model_post_save(label, pk):
    logger.debug('handle_model_post_save called with ({}, {})'.format(label, pk))
    return save_to_search_index(label, pk)


def save_to_search_index(label, pk):
    logger.debug('save_model_to_search_index called with ({}, {})'.format(label, pk))
    try:
        Model = apps.get_model(label)
        try:
            instance = Model.objects.get(id=pk)
            should_be_searchable = getattr(instance, 'published', True)
            logger.info('handle_model_post_save for model {}'.format(label))
            if should_be_searchable:
                SerializerClass = search_config.get_serializer_for_model(label)
                serializer = SerializerClass()
                doc = serializer.create_document(instance)
                doc.save()
                logger.info("save_model_to_search_index SAVE: '{}'".format(instance.id))
                return doc._id
            else:
                remove_from_search_index(label, pk)
        except ObjectDoesNotExist as e:
            logger.error(e)
    except LookupError as e:
        logger.error(e)

    return None


def handle_model_post_delete(label, pk):
    logger.debug('handle_model_post_save called with ({}, {})'.format(label, pk))
    return remove_from_search_index(label, pk)


def remove_from_search_index(label, pk, raise_on_404=False):
    DocType = search_config.get_doctype_for_model(label)
    if DocType:
        doc_id = calculate_doc_id(label, pk)
        try:
            doc_obj = DocType.get(doc_id)
            doc_obj.delete()
            return doc_id
        except Exception as e:
            logger.warn("Unable to find document with id='{}'. Unable to remove from search index".format(doc_id))
            if raise_on_404:
                raise e
    else:
        logger.error("Unable to find matching DocType for '{}'. Unable to remove from search index".format(label))

    return None


def index_model(label):
    logger.debug('index_model')
    Model = None
    SerializerClass = None
    try:
        Model = apps.get_model(label)
    except LookupError as e:
        logger.error(e)
        raise e
    try:
        SerializerClass = search_config.get_serializer_for_model(label)
    except LookupError as e:
        logger.error(e)
        raise e

    if Model and SerializerClass:
        serializer = SerializerClass()
        conn = connections.get_connection()  # Get default connection

        queryset = Model.objects.all()
        if hasattr(queryset, 'published'):
            queryset = queryset.published()
        if serializer.related_object_fields:
            queryset = queryset.prefetch_related(*serializer.related_object_fields)

        model_docs = (serializer.create_document(item) for item in queryset)
        doc_dicts = (doc.to_dict(include_meta=True) for doc in model_docs)

        return es_bulk(conn, doc_dicts)


def rebuild_indices(indices_config, subtask_indexing=False, verbosity=0):
    for name, config in indices_config.items():
        index_name = config.get('index')
        if index_name:
            doc_types = search_config.get_doctypes_for_index(index_name)
            if verbosity > 0:
                logger.info("Creating search index: '{}'".format(index_name))
            create_search_index(index_name, doc_types=doc_types, delete_if_exists=True)

    model_list = search_config.get_registered_models()

    index_func = partial(django_rq.enqueue, index_model) if subtask_indexing else index_model

    results = {}
    for model_label in model_list:
        if verbosity > 0:
            logger.info("Indexing model: '{}'".format(model_label))
        # Stores es_bulk response or job
        results[model_label] = index_func(model_label)

    return results


def schedule_periodic_index_rebuilds():
    base_dt = datetime.datetime.now(tz=get_default_timezone())
    replace_time = {
        'hour': 1,
        'minute': 15,
        'second': 0,
    }
    if base_dt.hour > replace_time['hour']:
        base_dt = base_dt + datetime.datetime.timedelta(days=1)
    after_midnight = base_dt.replace(**replace_time).astimezone(utc)

    scheduler = django_rq.get_scheduler('default')
    # Delete existing 'rebuild_indices' jobs
    for job in scheduler.get_jobs():
        if job.func_name == 'search.tasks.rebuild_indices':
            job.delete()

    scheduler.schedule(
        scheduled_time=after_midnight,
        func=rebuild_indices,
        args=[search_config._settings],
        kwargs={'verbosity': 1},
        interval=86400,  # Reindex daily
        repeat=None,
        result_ttl=None
    )
