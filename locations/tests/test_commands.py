import json
import os
import tempfile

from django.core.management import CommandError
from django.test import TestCase

from newsilkroad.test import CommandTestMixin
from .. import models


class ImportGeoDataTestCase(CommandTestMixin, TestCase):
    """Management command to import new Geo shapes into the system."""

    command = 'import_geodata'

    def setUp(self):
        super().setUp()
        self.handle, self.filename = tempfile.mkstemp(suffix='.json')
        os.close(self.handle)
        with open(self.filename, 'w') as f:
            data = {
               'type': 'Point',
               'coordinates': [30, 10]
            }
            json.dump(data, f)

    def tearDown(self):
        super().tearDown()
        os.remove(self.filename)

    def test_single_file(self):
        """Import geometries from a single file."""

        self.call_command(self.filename)
        stores = models.GeometryStore.objects.all()
        self.assertEqual(stores.count(), 1)
        store = stores.first()
        filename = os.path.basename(self.filename)
        name, _ext = os.path.splitext(filename)
        self.assertEqual(store.label, name)
        self.assertEqual(store.attributes, {'source': filename})
        self.assertEqual(store.points.count(), 1)
        point = store.points.first()
        self.assertEqual(point.latitude, 10.0)
        self.assertEqual(point.longitude, 30.0)
        self.assertEqual(store.points.count(), 1)
        self.assertEqual(store.lines.count(), 0)
        self.assertEqual(store.polygons.count(), 0)

    def test_multiple_files(self):
        """Import multiple files."""

        linehandle, linefile = tempfile.mkstemp(suffix='.json')
        os.close(linehandle)
        self.addCleanup(os.remove, linefile)
        with open(linefile, 'w') as f:
            data = {
               'type': 'LineString',
               'coordinates': [[0, 0], [10, 10]]
            }
            json.dump(data, f)

        polyhandle, polyfile = tempfile.mkstemp(suffix='.json')
        os.close(polyhandle)
        self.addCleanup(os.remove, polyfile)
        with open(polyfile, 'w') as f:
            data = {
               'type': 'Polygon',
               'coordinates': [[[0, 0], [-1, -1], [-1, 0], [0, 0], ]]
            }
            json.dump(data, f)
        self.call_command(self.filename, linefile, polyfile)
        stores = models.GeometryStore.objects.all()
        self.assertEqual(stores.count(), 3)

    def test_file_required(self):
        """At least one filename must be given."""

        with self.assertRaises(CommandError):
            self.call_command()

    def test_missing_file(self):
        """Handle files which don't exist on the file system."""

        newhandle, newfile = tempfile.mkstemp(suffix='.json')
        os.close(newhandle)
        os.remove(newfile)

        with self.assertRaises(CommandError):
            self.call_command(newfile)

    def test_invalid_file(self):
        """Handle invalid files on import."""

        with open(self.filename, 'w') as f:
            f.write('XXXXXXXXX')

        with self.assertRaises(CommandError):
            self.call_command(self.filename)

    def test_dry_run(self):
        """Check files but don't import them."""

        self.call_command(self.filename, dry_run=True)
        stores = models.GeometryStore.objects.all()
        self.assertEqual(stores.count(), 0)

    def test_verbose_output(self):
        """Higher verbosity will log additional messages."""

        filename = os.path.basename(self.filename)
        name, _ext = os.path.splitext(filename)

        with self.subTest('Verbose Dry Run'):
            stdout, stderr = self.call_command(self.filename, dry_run=True, verbosity=3)
            output = stdout.read()
            self.assertIn('Processing \'{}\''.format(name), output)
            self.assertNotIn('Created', output)

        with self.subTest('Verbose Import'):
            stdout, stderr = self.call_command(self.filename, verbosity=3)
            output = stdout.read()
            self.assertIn('Processing \'{}\''.format(name), output)
            store = models.GeometryStore.objects.first()
            self.assertIn('Created \'{}\''.format(store.identifier), output)

    def test_additional_attributes(self):
        """Attach additional attributes to the imported geometry."""

        self.call_command(self.filename, attributes=['foo=bar', 'blah=1', 'blip=100.0'])
        stores = models.GeometryStore.objects.all()
        self.assertEqual(stores.count(), 1)
        store = stores.first()
        filename = os.path.basename(self.filename)
        name, _ext = os.path.splitext(filename)
        self.assertEqual(store.label, name)
        self.assertEqual(
            store.attributes,
            {'source': filename, 'blah': 1, 'blip': 100.0, 'foo': 'bar'})
