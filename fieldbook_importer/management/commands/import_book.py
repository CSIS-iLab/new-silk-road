from django.core.management.base import BaseCommand, CommandError
from django.apps import apps
import argparse
import os.path
import json

from fieldbook_importer.utils import get_mapper
from fieldbook_importer.mappings import (
    PROJECT_MAP,
    PROJECT_M2M,
    INFRASTRUCTURETYPE_MAP,
    INITIATIVE_MAP,
    CONSULTANT_ORGANIZATION_MAP,
    OPERATOR_ORGANIZATION_MAP,
    CONTRACTOR_ORGANIZATION_MAP,
    IMPLEMENTING_AGENCY_ORGANIZATION_MAP,
    FUNDER_ORGANIZATION_MAP,
    PERSON_POC_MAP,
    PROJECT_DOCUMENT_MAP,
    PROJECT_FUNDING_MAP
)


class Command(BaseCommand):

    MAX_ERRORS = 10
    CONFIG_FORMAT_MSG = "Config should be a list of objects"

    def add_arguments(self, parser):
        parser.add_argument('--preflight', action='store_true', default=False)
        parser.add_argument('--dry-run', '-n', action='store_true', default=False)
        parser.add_argument(
            'configfile', type=argparse.FileType('r'),
            help='A JSON array of objects containing sheet and file (path) values.'
        )

    def handle(self, *args, **kwargs):
        self.dry_run = kwargs.get('dry_run')
        self.verbosity = kwargs.get('verbosity')
        self.configfile = kwargs.get('configfile')
        self.preflight = kwargs.get('preflight')
        self.err_count = 0
        self.data_sequence = []
        self.sheets = {
            'projects': {
                'model': 'infrastructure.Project',
                'mapping': PROJECT_MAP,
                'many_to_many': PROJECT_M2M
            },
            'program_initiatives': {
                'model': 'infrastructure.Initiative',
                'mapping': INITIATIVE_MAP,
                # 'related_mapping': INITIATIVE_RELATED_MAP,
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
            'client_implementing_agencies': {
                'model': 'facts.Organization',
                'mapping': IMPLEMENTING_AGENCY_ORGANIZATION_MAP,
            },
            'points_of_contact': {
                'model': 'facts.Person',
                'mapping': PERSON_POC_MAP,
            },
            'sources_of_fundings': {
                'model': 'facts.Organization',
                'mapping': FUNDER_ORGANIZATION_MAP
            },
            'project_funding': {
                'model': 'infrastructure.ProjectFunding',
                'mapping': PROJECT_FUNDING_MAP
            },
            'documents': {
                'model': 'infrastructure.ProjectDocument',
                'mapping': PROJECT_DOCUMENT_MAP
            }
        }

        self.configure(self.configfile)

        if self.preflight:
            for item in self.data_sequence:
                sheet_info = 'Sheet: {}'.format(item.get('sheet'))
                self.stdout.write(sheet_info)
                data = item.get('data', [])
                self.stdout.write('Data items: {}'.format(len(data)))
        else:
            self._process_data()

    def _process_data(self):
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
                    self.stderr.write(self.style.WARNING("No mapping available for {}, skipping".format(sheetname)))

    def configure(self, configfile):
        basename = os.path.abspath(os.path.dirname(configfile.name))
        config = json.load(configfile)

        if not isinstance(config, list):
            raise CommandError(Command.CONFIG_FORMAT_MSG)

        for item in config:
            if not isinstance(item, dict):
                raise CommandError(Command.CONFIG_FORMAT_MSG)
            sheet = item.get('sheet', None)
            pathinfo = item.pop('file', None)
            if sheet and not pathinfo:
                # If a sheet name is provided but not a path, assume sheetname.json
                pathinfo = "{}.json".format(sheet)
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

    def load_data(self, data, model_class, mapping, many_to_many=None):
        create_obj = self._get_model_constructor(model_class)
        model_name = model_class._meta.model_name

        value_mapper = get_mapper(mapping)

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
            if many_to_many:
                for key, func in many_to_many.items():
                    if not self.dry_run:
                        related_manager = getattr(obj, key, None)
                        if related_manager:
                            related_objects = func(item)
                            if related_objects:
                                related_manager.add(*related_objects)
                        obj.save()
                    elif self.verbosity > 2:
                        self.stdout.write("Processing '{}' many_to_many".format(key))
