from django.core.management.base import BaseCommand, CommandError
import argparse
import json

from infrastructure.models import Project, ProjectStatus

from fieldbook_importer.mappings import PROJECT_MODEL_MAP


class Command(BaseCommand):

    MAX_ERRORS = 10

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', '-n', action='store_true', default=False)
        parser.add_argument('infile', type=argparse.FileType('r'))

    def handle(self, *args, **kwargs):
        dry_run = kwargs.get('dry_run')
        verbosity = kwargs.get('verbosity')
        infile = kwargs.get('infile')
        err_count = 0

        create_project = Project if dry_run else Project.objects.create

        data = json.load(infile)

        for item in data:
            value_map = {key: func(item) for key, func in PROJECT_MODEL_MAP if key and callable(func)}
            if verbosity > 2:
                self.stdout.write(repr(value_map))
            obj = create_project(**value_map)
            if dry_run:
                try:
                    obj.full_clean()
                except Exception as e:
                    self.stderr.write("Error with project {}".format(item.get('id', repr(item))))
                    self.stderr.write(repr(e))
                    err_count += 1
                    if err_count > Command.MAX_ERRORS:
                        raise CommandError("Too many errors, aborting")
