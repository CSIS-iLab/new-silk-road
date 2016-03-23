from django.core.management.base import BaseCommand, CommandError
from django.apps import apps
import argparse
import os.path
import json

from fieldbook_importer.mappings import (
    PROJECT_MAP, PROJECT_RELATED_MAP,
    INFRASTRUCTURETYPE_MAP,
    CONSULTANT_ORGANIZATION_MAP,
    OPERATOR_ORGANIZATION_MAP,
    CONTRACTOR_ORGANIZATION_MAP
)


class Command(BaseCommand):

    MAX_ERRORS = 10
    CONFIG_FORMAT_MSG = "Config should be a list of objects"

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', '-n', action='store_true', default=False)
        parser.add_argument(
            'configfile', type=argparse.FileType('r'),
            help='A JSON array of objects containing sheet and file (path) values.'
        )

    def handle(self, *args, **kwargs):
        self.dry_run = kwargs.get('dry_run')
        self.verbosity = kwargs.get('verbosity')
        self.configfile = kwargs.get('configfile')
        self.err_count = 0
        self.data_sequence = []
        self.sheets = {
            'projects': {
                'model': 'infrastructure.Project',
                'mapping': PROJECT_MAP,
                'related_mapping': PROJECT_RELATED_MAP
            },
            'infrastructure_types': {
                'model': 'infrastructure.InfrastructureType',
                'mapping': INFRASTRUCTURETYPE_MAP
            },
            'consultants': {
                'model': 'facts.Organization',
                'mapping': CONSULTANT_ORGANIZATION_MAP,
            },
            'operators': {
                'model': 'facts.Organization',
                'mapping': OPERATOR_ORGANIZATION_MAP,
            },
            'contractors': {
                'model': 'facts.Organization',
                'mapping': CONTRACTOR_ORGANIZATION_MAP,
            },
        }

        self.configure(self.configfile)

        for item in self.data_sequence:
            # Fail hard on nonexistent keys, at least for now
            data = item.get('data')
            sheetname = item.get('sheet')

            conf = self.sheets.get(sheetname)

            if conf:
                params = conf.copy()
                modelname = params.pop('model')
                if self.verbosity > 1:
                    self.stdout.write("Processing '{}' data as {}".format(sheetname, modelname))
                model = apps.get_model(modelname)
                self.load_data(data, model, **params)
            else:
                self.stderr.write("No mapping available for {}, skipping".format(sheetname))

    def configure(self, configfile):
        basename = os.path.abspath(os.path.dirname(configfile.name))
        config = json.load(configfile)

        if not isinstance(config, list):
            raise CommandError(Command.CONFIG_FORMAT_MSG)

        for item in config:
            if not isinstance(item, dict):
                raise CommandError(Command.CONFIG_FORMAT_MSG)
            pathinfo = item.pop('file', None)
            sheet = item.get('sheet', None)
            if pathinfo and sheet:
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

    def _get_model_constructor(self, klass):
        if self.dry_run:
            return klass
        return klass.objects.get_or_create

    def _get_mapper(self, mapping):
        def mapper(item):
            return {key: func(item) for key, func in mapping.items() if key and callable(func)}
        return mapper

    def load_data(self, data, model_class, mapping, related_mapping=None):
        create_obj = self._get_model_constructor(model_class)
        model_name = model_class._meta.model_name

        value_mapper = self._get_mapper(mapping)

        for item in data:
            value_map = value_mapper(item)
            if self.verbosity > 2:
                self.stdout.write(repr(value_map))
            obj = create_obj(**value_map)
            if isinstance(obj, tuple):
                obj, _ = obj
            if self.dry_run:
                try:
                    obj.full_clean()
                except Exception as e:
                    self.stderr.write("Error with {} {}".format(model_name, item.get('id', repr(item))))
                    self.stderr.write(repr(e))
                    self.track_error()
            if related_mapping:
                related_mapper = self._get_mapper(related_mapping)
                related_value_map = related_mapper(item)
                for key, rel_obj in related_value_map.items():
                    if rel_obj and hasattr(obj, key):
                        rel_obj.save()
                        setattr(obj, key, rel_obj)
                obj.save()
