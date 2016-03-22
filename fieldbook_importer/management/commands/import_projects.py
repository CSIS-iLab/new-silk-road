from django.core.management.base import BaseCommand, CommandError
import argparse
import os.path
import json

from infrastructure.models import (
    Project,
    InfrastructureType
)

from fieldbook_importer.mappings import PROJECT_MODEL_MAP, PROJECT_RELATED_OBJECTS_MAP


class Command(BaseCommand):

    MAX_ERRORS = 10
    CONFIG_FORMAT_MSG = "Config should be a list of objects"

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', '-n', action='store_true', default=False)
        parser.add_argument('configfile', type=argparse.FileType('r'))

    def handle(self, *args, **kwargs):
        self.dry_run = kwargs.get('dry_run')
        self.verbosity = kwargs.get('verbosity')
        self.configfile = kwargs.get('configfile')
        self.err_count = 0
        self.data_sequence = []
        self.model_methods = {
            'infrastructure.Project': self.load_projects,
            'infrastructure.InfrastructureType': self.load_infrastructure_types
        }

        self.configure(self.configfile)

        for item in self.data_sequence:
            # Fail hard on nonexistent keys, at least for now
            model = item.get('model')
            data = item.get('data')
            if self.verbosity > 1:
                self.stdout.write("Processing data for {}".format(model))
            if model in self.model_methods:
                self.model_methods[model](data)

    def configure(self, configfile):
        basename = os.path.abspath(os.path.dirname(configfile.name))
        config = json.load(configfile)

        if not isinstance(config, list):
            raise CommandError(Command.CONFIG_FORMAT_MSG)

        for item in config:
            if not isinstance(item, dict):
                raise CommandError(Command.CONFIG_FORMAT_MSG)
            pathinfo = item.pop('file', None)
            model = item.get('model', None)
            if pathinfo and model:
                fpath = pathinfo if os.path.isabs(pathinfo) else os.path.join(basename, pathinfo)
                # Replace file with data, add to data_sequence
                if os.path.exists(fpath):
                    item['data'] = json.load(open(fpath, 'r'))
                    self.data_sequence.append(item)
                else:
                    self.stderr.write("Error loading data using config")

    def track_error(self):
        self.err_count += 1
        if self.err_count > Command.MAX_ERRORS:
            raise CommandError("Too many errors, aborting")

    def load_projects(self, data):
        create_project = Project if self.dry_run else Project.objects.create

        for item in data:
            value_map = {key: func(item) for key, func in PROJECT_MODEL_MAP if key and callable(func)}
            related_objects = {key: func(item) for key, func in PROJECT_RELATED_OBJECTS_MAP if key and callable(func)}
            if self.verbosity > 2:
                self.stdout.write(repr(value_map))
            obj = create_project(**value_map)
            if self.dry_run:
                try:
                    obj.full_clean()
                except Exception as e:
                    self.stderr.write("Error with project {}".format(item.get('id', repr(item))))
                    self.stderr.write(repr(e))
                    self.track_error()
            else:
                for key, rel_obj in related_objects.items():
                    if rel_obj and hasattr(obj, key):
                        rel_obj.save()
                        setattr(obj, key, rel_obj)
                obj.save()

    def load_infrastructure_types(self, data):
        create_obj = InfrastructureType if self.dry_run else InfrastructureType.objects.create

        for item in data:
            value_map = {
                'name': item.get('infrastructure_type_name')
            }
            if self.verbosity > 2:
                self.stdout.write(repr(value_map))
            obj = create_obj(**value_map)
            if self.dry_run:
                try:
                    obj.full_clean()
                except Exception as e:
                    self.stderr.write("Error with infrastructure_type {}".format(item.get('id', repr(item))))
                    self.stderr.write(repr(e))
                    self.track_error()
            else:
                obj.save()
