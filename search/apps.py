from django.apps import AppConfig
from elasticsearch_dsl import Index
import django_rq
from search.utils import create_search_index
from search.registry import SearchRegistry
from search import DEFAULT_INDEX
import logging

logger = logging.getLogger(__package__)


class SearchConfig(AppConfig):
    name = 'search'

    def ready(self):
        # TODO: Configure task to know what models have what doctypes have what serializers?
        # NOTE: Seralizers have model and doc_type in Meta, so registering/configuring serializers

        self.registry = SearchRegistry()
        self.registry.register((
            'EntrySerializer',
            'ProjectSerializer'
        ))

        # Ensure default search index exists
        index = Index(DEFAULT_INDEX)
        if not index.exists():
            logger.debug("Default search index '{}' missing".format(DEFAULT_INDEX))
            index_doc_types = self.registry.doctypes_for_index(DEFAULT_INDEX)
            django_rq.enqueue(create_search_index, DEFAULT_INDEX, doc_types=index_doc_types)
            # create_search_index(DEFAULT_INDEX, doc_types=index_doc_types)

        import search.signals  # noqa: F401
