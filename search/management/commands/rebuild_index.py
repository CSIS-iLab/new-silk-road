from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from search.tasks import rebuild_indices


class Command(BaseCommand):

    def handle(self, *args, **options):
        if not hasattr(settings, 'SEARCH'):
            raise CommandError('Django settings must include SEARCH dictionary setting')
        result = rebuild_indices(settings.SEARCH)

        for key, value in result.items():
            count_value = value[0] if isinstance(value, tuple) else '?'
            self.stdout.write("Reindexed {} '{}' documents".format(count_value, key))
