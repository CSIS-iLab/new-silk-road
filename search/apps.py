from django.apps import AppConfig
from search.signals import connect_elasticsearch_signals


class SearchConfig(AppConfig):
    name = 'search'

    def ready(self):
        from search.mappings import EntryMapping
        connect_elasticsearch_signals({
            'writings.Entry': EntryMapping,
        })
