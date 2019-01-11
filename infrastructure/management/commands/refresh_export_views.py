from django.core.management.base import BaseCommand
from infrastructure.export import refresh_views


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        refresh_views()
