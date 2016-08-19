from django.apps import apps
from django.core.exceptions import ObjectDoesNotExist
from django_rq import job
import logging

logger = logging.getLogger(__package__)


@job
def handle_model_post_save(label, pk):
    logger.debug('handle_model_post_save called with ({}, {})'.format(label, pk))
    try:
        Model = apps.get_model(label)
        try:
            Model.objects.get(id=pk)
            logger.info('handle_model_post_save for model {}'.format(label))
        except ObjectDoesNotExist as e:
            logger.error(e)
    except LookupError as e:
        logger.error(e)
