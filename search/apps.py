from django.apps import AppConfig
import logging
from search.signals import connect_elasticsearch_signals

logger = logging.getLogger(__name__)


class SearchConfig(AppConfig):
    name = 'search'
    first_run = True

    def ready(self):
        logger.info('Configuring search...')

        if self.first_run:

            from search.mappings import EntryMapping
            connect_elasticsearch_signals({
                'writings.Entry': EntryMapping,
            })

            self.first_run = False
