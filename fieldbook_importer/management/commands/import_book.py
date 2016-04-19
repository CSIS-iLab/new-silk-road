from django.core.management.base import BaseCommand, CommandError
from django.db.utils import IntegrityError
from django.apps import apps
import argparse
import os.path
import json

from fieldbook_importer.transformers import (
    transform_project_data,
    transform_project_related_data,
    transform_infrastructuretype_data,
    transform_initiative_data,
    transform_consultant_organization,
    transform_operator_organization,
    transform_contractor_organization,
    transform_implementing_agency_organization,
    transform_funder_organization,
    transform_project_funding_data,
    transform_project_document_data,
    transform_person_poc,
    make_organization_related_transformer,
)
from fieldbook_importer.utils import (
    instance_for_model,
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
                'transformer': transform_project_data,
                'related': transform_project_related_data
            },
            'programs_initiatives': {
                'model': 'infrastructure.Initiative',
                'transformer': transform_initiative_data,
            },
            'infrastructure_types': {
                'model': 'infrastructure.InfrastructureType',
                'transformer': transform_infrastructuretype_data
            },
            'consultants': {
                'model': 'facts.Organization',
                'transformer': transform_consultant_organization,
                'related': make_organization_related_transformer("consultant_name")
            },
            'operators': {
                'model': 'facts.Organization',
                'transformer': transform_operator_organization,
                'related': make_organization_related_transformer("operator_name")
            },
            'contractors': {
                'model': 'facts.Organization',
                'transformer': transform_contractor_organization,
                'related': make_organization_related_transformer("contractors_name")
            },
            'client_implementing_agencies': {
                'model': 'facts.Organization',
                'transformer': transform_implementing_agency_organization,
                'related': make_organization_related_transformer("client_implementing_agency_name")
            },
            'points_of_contact': {
                'model': 'facts.Person',
                'transformer': transform_person_poc,
            },
            'sources_of_funding': {
                'model': 'facts.Organization',
                'transformer': transform_funder_organization,
                'related': make_organization_related_transformer("sources_of_funding_name")
            },
            'project_funding': {
                'model': 'infrastructure.ProjectFunding',
                'transformer': transform_project_funding_data,
            },
            'documents': {
                'model': 'infrastructure.ProjectDocument',
                'transformer': transform_project_document_data
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
                    if self.verbosity > 2:
                        self.stderr.write("Could not find '{}'".format(fpath))

    def _get_model_constructor(self, klass):
        if self.dry_run:
            return klass
        return klass.objects.get_or_create

    def _process_m2m_objects(self, obj, key, related_objects):
        manager = getattr(obj, key, None)
        if manager and related_objects:
            related_objects = list((obj for obj in related_objects if obj))
            for rel_obj in related_objects:
                if rel_obj.id is None:
                    try:
                        rel_obj.save()
                    except IntegrityError as e:
                        self.stderr.write(repr(e))
                        self.stderr.write(repr(rel_obj))
                    except Exception as e:
                        raise e
            manager.add(*related_objects)

    def _process_one2one_object(self, obj, key, data):
        '''For one2one objects, we expect the key to be a model_label, e.g. app.ModelName'''
        if isinstance(data, dict):
            data[obj._meta.model_name] = obj
            try:
                instance = instance_for_model(key, data, create=True)
                if self.verbosity > 2:
                    self.stdout.write("Created {}".format(str(instance)))
            except IntegrityError as e:
                self.stderr.write(repr(e))
                self.stderr.write(repr(data))
            except Exception as e:
                raise e
        else:
            raise CommandError("Attempted to process a one2one with non-dict data")

    def load_data(self, data, model_class, transformer, related=None):
        create_obj = self._get_model_constructor(model_class)
        model_name = model_class._meta.model_name

        for item in data:
            transformed_item = transformer(item)
            if self.verbosity > 2:
                self.stdout.write(repr(transformed_item))
            obj = None
            if transformed_item:
                try:
                    obj = create_obj(**transformed_item)
                except IntegrityError as e:
                    self.stderr.write(repr(e))
                    self.stderr.write(repr(transformed_item))
                except Exception as e:
                    raise e
            if obj:
                if isinstance(obj, tuple):
                    obj, _ = obj
                if self.dry_run:
                    try:
                        obj.full_clean()
                    except Exception as e:
                        self.stderr.write("Error with {} {}".format(model_name, item.get('id', repr(item))))
                        self.stderr.write(repr(e))
                if related:
                    related_transforms = related(item)
                    for key, value in related_transforms.items():
                        if not self.dry_run:
                            rel_type, data = value
                            if rel_type == 'm2m':
                                self._process_m2m_objects(obj, key, data)
                            elif rel_type == 'one2one':
                                self._process_one2one_object(obj, key, data)
                            obj.save()
                        elif self.verbosity > 2:
                            self.stdout.write("Processing '{}' related".format(key))
