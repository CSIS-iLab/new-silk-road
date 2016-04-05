from django.core.management.base import BaseCommand, CommandError
from django.contrib.gis.gdal import DataSource
import os.path

from locations.models import PointGeometry, LineStringGeometry, PolygonGeometry


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', '-n', action='store_true', default=False)
        parser.add_argument(
            'files', nargs='+',
            help='A filepath or glob of filepaths'
        )

    def handle(self, *args, **kwargs):
        infiles = kwargs.get('files')
        self.verbosity = kwargs.get('verbosity')
        self.dry_run = kwargs.get('dry_run')

        if self.verbosity > 1:
            self.stdout.write(self.style.NOTICE('3D geometries will be flattened!'))

        for f in infiles:
            path, filename = os.path.split(f)
            fname, fext = os.path.splitext(filename)
            if self.verbosity > 2:
                self.stdout.write(fname)
            try:
                ds = DataSource(f)
            except Exception as e:
                raise CommandError(e)

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
                        data['source'] = filename
                        if not self.dry_run:
                            GeoModel.objects.create(geometry=geom.wkt, attributes=data)
                        else:
                            self.stdout.write(self.style.SUCCESS('Parsed feature {feat.fid} in {feat.layer_name}, but did not save (dry-run)'.format(feat=feat)))
