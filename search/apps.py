from django.apps import AppConfig
from django.conf import settings
import logging
from elasticsearch_dsl.connections import connections
from search.documents import (
    ProjectDoc, EntryDoc
)
from search.index import create_search_index
from search.signals import connect_elasticsearch_signals
from urllib.parse import urlparse


ELASTICSEARCH_URL = getattr(settings, 'ELASTICSEARCH_URL', 'http://localhost:9200')
logger = logging.getLogger(__name__)


class SearchConfig(AppConfig):
    name = 'search'
    first_run = True

    def ready(self):
        logger.info('SearchConfig ready!')

        if self.first_run:
            parsed_url = urlparse(ELASTICSEARCH_URL)
            connections.create_connection(hosts=[parsed_url.netloc], timeout=20)

            create_search_index('reconnectingasia', (EntryDoc, ProjectDoc))
            from search.mappings import EntryMapping
            connect_elasticsearch_signals({
                'writings.Entry': EntryMapping,
            })

            self.first_run = False
