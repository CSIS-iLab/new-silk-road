from django.core.management.base import BaseCommand, CommandError
from django.contrib.gis.gdal import DataSource
from django.contrib.gis.geos import GeometryCollection
import os.path

from locations.models import (
    MultiGeometry
)

FILENAME_TRANSLATION_TABLE = str.maketrans('?', '–')


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', '-n', action='store_true', default=False)
        parser.add_argument(
            'files',
            nargs='+',
            help='A filepath or glob of filepaths'
        )
        parser.add_argument(
            '--no-collect',
            action='store_true',
            help='Put geometries for a file into a collection'
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
        self.no_collect = kwargs.get('no_collect')
        # Attempt to parse additional attributes
        raw_attrs = kwargs.get('attributes')
        self.attributes = self._create_attributes(raw_attrs) if raw_attrs else {}

        if self.verbosity > 1:
            self.stdout.write(self.style.NOTICE('3D geometries will be flattened!'))

        for f in infiles:
            path, filename = os.path.split(f)
            fname, fext = os.path.splitext(filename)
            self.stdout.write("Processing '{}'".format(fname))
            self.attributes['source'] = filename
            try:
                ds = DataSource(f)
            except Exception as e:
                raise CommandError(e)

            clean_name = fname.translate(FILENAME_TRANSLATION_TABLE).strip()

            geo_coll = None
            for layer in ds:
                layer_name, ext = os.path.splitext(layer.name)
                if self.verbosity > 2:
                    self.stdout.write('Layer "{}": {} {}s'.format(layer_name, len(layer), layer.geom_type.name))
                for feat in layer:
                    # Remove 3rd dimension
                    geom = feat.geom.clone()
                    geom.coord_dim = 2
                    if not geo_coll:
                        geo_coll = GeometryCollection(geom.geos)
                    else:
                        geo_coll.append(geom.geos)

            if geo_coll and not self.dry_run:
                # Create attributes dict from geom fields
                data = {f.name.lower(): f.value for f in feat}
                # Add source information to attributes
                data['layer'] = layer_name
                data.update(self.attributes)
                MultiGeometry.objects.create(
                    label=clean_name,
                    geometry=geo_coll,
                    attributes=data
                )
            else:
                if self.verbosity > 2:
                    self.stdout.write("Created geometry collection\n{}\n".format(geo_coll.wkt))
