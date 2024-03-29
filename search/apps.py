import logging

from django.apps import AppConfig
from django.conf import settings
from django.db.models.signals import post_save, post_delete

from search.conf import SearchConf

logger = logging.getLogger(__package__)


class SearchAppConfig(AppConfig):
    name = 'search'

    def ready(self):
        if getattr(settings, 'SEARCH_SIGNALS', False):
            from search.signals import run_post_save_search_tasks, run_post_delete_search_tasks  # noqa: F401

            search_conf = SearchConf(auto_setup=True)
            model_labels = search_conf.get_registered_models()

            logger.info('Connect post_save signals for {} models'.format(len(model_labels)))

            for label in model_labels:
                logger.info('Connecting post_save for {}'.format(label))
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

        try:
            from search.tasks import schedule_periodic_index_rebuilds
            # This should tell our rq-scheduler to run rebuild_indices periodically
            schedule_periodic_index_rebuilds()
        except Exception:
            pass
