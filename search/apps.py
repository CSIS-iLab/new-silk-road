from django.apps import AppConfig
from search.signals import connect_elasticsearch_signals


class SearchConfig(AppConfig):
    name = 'search'

    def ready(self):
        from search.serializers import EntrySerializer
        connect_elasticsearch_signals({
            'writings.Entry': EntrySerializer,
        })
