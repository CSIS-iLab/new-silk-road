from django.core.management.base import BaseCommand, CommandError
import os.path
from utilities.string import clean_string
from locations.utils import geostore_from_file


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', '-n', action='store_true', default=False)
        parser.add_argument(
            'files',
            nargs='+',
            help='A filepath or glob of filepaths'
        )
        parser.add_argument(
            '--attributes',
            nargs='+',
            help='Add extra attributes for imported geodata'
        )

    def _create_attributes(self, raw_attributes):
        attributes = {
            k: v for k, v in [x.split('=') for x in raw_attributes if '=' in x]
        }
        for key in attributes.keys():
            value = attributes[key]
            if value.isnumeric():
                attributes[key] = int(value)
            elif value[0].isnumeric() and '.' in value:
                try:
                    attributes[key] = float(value)
                except:
                    pass
        return attributes

    def handle(self, *args, **kwargs):
        infiles = kwargs.get('files')
        self.verbosity = kwargs.get('verbosity')
        self.dry_run = kwargs.get('dry_run')
        # Attempt to parse additional attributes
        raw_attrs = kwargs.get('attributes')
        self.attributes = self._create_attributes(raw_attrs) if raw_attrs else {}

        if self.verbosity > 1:
            self.stdout.write(self.style.NOTICE('3D geometries will be flattened!'))

        for f in infiles:
            path, filename = os.path.split(f)
            fname, fext = os.path.splitext(filename)
            self.stdout.write("Processing '{}'".format(fname))
            self.attributes['source'] = clean_string(filename)

            try:
                geo_store = geostore_from_file(
                    f, fname,
                    verbosity=self.verbosity,
                    geo_attributes=self.attributes,
                    create=True if not self.dry_run else False
                )
                if geo_store:
                    self.stdout.write(self.style.SUCCESS("Created '{}'".format(geo_store.identifier)))
                else:
                    self.stderr.write(self.style.ERROR("Unable to create Geostore for '{}'".format(filename)))
            except Exception as e:
                raise CommandError(e)
