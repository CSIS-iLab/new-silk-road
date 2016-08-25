import logging
from search.tasks import handle_model_post_save, handle_model_post_delete

logger = logging.getLogger(__package__)


def run_post_save_search_tasks(sender, **kwargs):
    logger.debug("Running run_post_save_search_tasks for sender '{}'".format(sender))
    if hasattr(sender, '_meta'):
        instance = kwargs.get('instance')
        handle_model_post_save.delay(sender._meta.label, instance.id)


def run_post_delete_search_tasks(sender, **kwargs):
    logger.debug("Running run_post_delete_search_tasks for sender '{}'".format(sender))
    if hasattr(sender, '_meta'):
        instance = kwargs.get('instance')
        handle_model_post_delete.delay(sender._meta.label, instance.id)
