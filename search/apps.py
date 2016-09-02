from django.apps import AppConfig
from django.db.models.signals import post_save, post_delete
from search.conf import SearchConf
import logging

logger = logging.getLogger(__package__)


class SearchAppConfig(AppConfig):
    name = 'search'

    def ready(self):
        from search.signals import run_post_save_search_tasks, run_post_delete_search_tasks  # noqa: F401

        search_conf = SearchConf()
        model_labels = search_conf.get_registered_models()

        for label in model_labels:
            logger.debug('Connecting post_save for {}'.format(label))
            post_save.connect(
                run_post_save_search_tasks,
                sender=label,
                dispatch_uid='run_post_save_search_tasks::{}'.format(label)
            )
            post_delete_uid = 'run_post_delete_search_tasks::{}'.format(label)
            post_delete.connect(
                run_post_delete_search_tasks,
                sender=label,
                dispatch_uid=post_delete_uid
            )
