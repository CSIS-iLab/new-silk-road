from django.core.management.base import BaseCommand, CommandError
from django.contrib.gis.gdal import DataSource
import os.path

from locations.models import (
    PointGeometry,
    LineStringGeometry,
    PolygonGeometry,
    GeometryCollection
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
            collection = GeometryCollection.objects.create(
                label=clean_name,
                attributes=self.attributes.copy()
            ) if not self.no_collect and not self.dry_run else None

            for layer in ds:
                layer_name, ext = os.path.splitext(layer.name)
                if self.verbosity > 2:
                    self.stdout.write('Layer "{}": {} {}s'.format(layer_name, len(layer), layer.geom_type.name))
                for feat in layer:
                    GeoModel = None
                    if feat.geom.geom_name == 'POINT':
                        GeoModel = PointGeometry
                    elif feat.geom.geom_name == 'LINESTRING':
                        GeoModel = LineStringGeometry
                    elif feat.geom.geom_name == 'POLYGON':
                        GeoModel = PolygonGeometry
                    else:
                        warn_msg = self.style.WARNING('No matching locations.Model for geometry \'{}\''.format(layer.geom_type.name))
                        self.stderr.write(warn_msg)

                    if GeoModel:
                        # Remove 3rd dimension
                        geom = feat.geom.clone()
                        geom.coord_dim = 2
                        # Create attributes dict from geom fields
                        data = {f.name.lower(): f.value for f in feat}
                        # Add source information to attributes
                        data['layer'] = layer_name
                        data.update(self.attributes)
                        if not self.dry_run:
                            GeoModel.objects.create(
                                label=data.get('name', layer_name),
                                geometry=geom.wkt,
                                attributes=data,
                                collection=collection
                            )
                        else:
                            self.stdout.write(self.style.SUCCESS('Parsed feature {feat.fid} in {feat.layer_name}, but did not save (dry-run)'.format(feat=feat)))
