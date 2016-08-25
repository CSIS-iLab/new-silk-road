from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from search.utils import create_search_index


class Command(BaseCommand):
    help = 'Create the specified index in Elasticsearch, or create the search indices specified in the SEARCH config'

    def add_arguments(self, parser):
        parser.add_argument('index_name', nargs='?', default=None)

    def handle(self, *args, **options):
        index_name = options.get('index_name')
        if index_name:
            create_search_index(index_name)
            self.stdout.write(self.style.SUCCESS("Created search index '{}'".format(index_name)))
        else:
            self.stdout.write("Creating search indices from settings")
            SEARCH = getattr(settings, 'SEARCH', None)
            if SEARCH and isinstance(SEARCH, dict):
                for name, config in SEARCH.items():
                    index_name = config.get('index')
                    if index_name:
                        self.stdout.write("Creating search index '{}'".format(index_name))
                        doc_types = config.get('doc_types', None)
                        create_search_index(index_name, doc_types=doc_types)
                    else:
                        self.stdout.write(self.style.WARNING("No index specified for '{}'".name))
            else:
                raise CommandError('SEARCH not set in django settings')
