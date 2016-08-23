from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from elasticsearch_dsl.connections import connections

default_app_config = 'search.apps.SearchConfig'

SEARCH_CONFIG = getattr(settings, 'SEARCH', None)
if not SEARCH_CONFIG:
    raise ImproperlyConfigured('SEARCH settings dictionary must be provided')
if 'default' not in SEARCH_CONFIG:
    raise ImproperlyConfigured("SEARCH settings must include 'default' settings dict, similar to DATABASES")
if 'index' not in SEARCH_CONFIG['default']:
    raise ImproperlyConfigured("SEARCH settings must include a name for 'index' in 'default' settings dict")

# Set up ES connection
connection_settings = SEARCH_CONFIG['default'].get('connections')
if not connection_settings:
    raise ImproperlyConfigured("SEARCH settings must include 'connections' dict in 'default'")
connections.configure(default=connection_settings)
