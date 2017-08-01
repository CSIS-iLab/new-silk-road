import json
import os
import tempfile

from django.core.management.base import CommandError
from django.test import TestCase

from locations.models import GeometryStore
from newsilkroad.test import CommandTestMixin
from ..models import Initiative, Project


class MatchProjectGeometriesTestCase(CommandTestMixin, TestCase):
    """Management command to match projects to their geometry stores."""

    command = 'match_project_geometries'

    def setUp(self):
        super().setUp()
        self.project = Project.objects.create(name='Test Project')
        self.other = Project.objects.create(name='Other Project')

    def test_no_geometries(self):
        """Run command with no geometries to match."""

        self.call_command()
        # Both projects should be unchanged
        self.project.refresh_from_db()
        self.other.refresh_from_db()
        self.assertIsNone(self.project.geo)
        self.assertIsNone(self.other.geo)

    def test_match_geometry_to_project(self):
        """Update project with the matched geometry."""

        match = GeometryStore.objects.create(label='Test Project')
        stdout, stderr = self.call_command()
        self.assertIn('Matched GeometryStore \'Test Project\'', stdout.read())
        # Project should be updated
        self.project.refresh_from_db()
        self.assertEqual(self.project.geo, match)
        # Other should be unchanged
        self.other.refresh_from_db()
        self.assertIsNone(self.other.geo)

    def test_dry_run_match(self):
        """Check for matches but don't update the projects."""

        GeometryStore.objects.create(label='Test Project')
        stdout, stderr = self.call_command(dry_run=True)
        self.assertIn('Matched GeometryStore \'Test Project\'', stdout.read())
        # Both projects should be unchanged
        self.project.refresh_from_db()
        self.other.refresh_from_db()
        self.assertIsNone(self.project.geo)
        self.assertIsNone(self.other.geo)

    def test_match_existing_geometry(self):
        """Don't change the geometry on a project if it has already been set."""

        store = GeometryStore.objects.create()
        self.project.geo = store
        self.project.save()
        match = GeometryStore.objects.create(label='Test Project')
        stdout, stderr = self.call_command()
        self.assertIn('\'Test Project\' already has associated geodata', stderr.read())
        # Project should be unchanged
        self.project.refresh_from_db()
        self.assertNotEqual(self.project.geo, match)
        self.assertEqual(self.project.geo, store)
        # Other should be unchanged
        self.other.refresh_from_db()
        self.assertIsNone(self.other.geo)

    def test_multiple_matches(self):
        """Geometry will not be updated if there are multiple matched projects."""

        # This will match both since they both have the work Project in their name
        GeometryStore.objects.create(label='Project')
        self.call_command()
        # Both projects should be unchanged
        self.project.refresh_from_db()
        self.other.refresh_from_db()
        self.assertIsNone(self.project.geo)
        self.assertIsNone(self.other.geo)

    def test_missing_name(self):
        """Show a warning when a GeometryStore is missing a name."""

        store = GeometryStore.objects.create()
        stdout, stderr = self.call_command()
        self.assertIn('Geometry {} has no \'name\''.format(str(store.identifier)), stderr.read())
        # Both projects should be unchanged
        self.project.refresh_from_db()
        self.other.refresh_from_db()
        self.assertIsNone(self.project.geo)
        self.assertIsNone(self.other.geo)

    def test_verbose_matching(self):
        """Additional logging at high verbosity."""

        match = GeometryStore.objects.create(label='Test Project')
        stdout, stderr = self.call_command(verbosity=2)
        stdout = stdout.read()
        self.assertIn(
            'Attempting to match collection \'{}\''.format(str(match.identifier)),
            stdout)
        self.assertIn('Matched GeometryStore \'Test Project\'', stdout)

    def test_quiet_matching(self):
        """Less logging if requested."""

        GeometryStore.objects.create(label='Test Project')
        stdout, stderr = self.call_command(verbosity=0)
        stdout = stdout.read()
        self.assertEqual(stdout, '')


class MatchProjectInitiativesTestCase(CommandTestMixin, TestCase):
    """Match projects to their initiatives via JSON file mapping."""

    command = 'match_projects_to_initiatives'

    def setUp(self):
        super().setUp()
        self.handle, self.filename = tempfile.mkstemp(suffix='.json')
        os.close(self.handle)
        self.project = Project.objects.create(name='Test Project')
        self.other = Project.objects.create(name='Other Project')
        self.initiative = Initiative.objects.create(name='Test Initiative')

    def tearDown(self):
        super().tearDown()
        os.remove(self.filename)

    def test_empty_file(self):
        """Handle an empty file passed to the command."""

        with self.assertRaises(CommandError):
            self.call_command(self.filename)
        self.assertEqual(self.project.initiatives.count(), 0)
        self.assertEqual(self.other.initiatives.count(), 0)

    def test_invalid_file(self):
        """Handle an invalid JSON file passed to the command."""

        with open(self.filename, 'w') as f:
            f.write('xxxxx')

        with self.assertRaises(CommandError):
            self.call_command(self.filename)
        self.assertEqual(self.project.initiatives.count(), 0)
        self.assertEqual(self.other.initiatives.count(), 0)

    def test_default_field_mapping(self):
        """Map the initiatives using the default field names."""

        with open(self.filename, 'w') as f:
            data = [
                {'project_title': 'Test Project', 'initiative_name': 'Test Initiative'}
            ]
            json.dump(data, f)

        self.call_command(self.filename)
        self.assertEqual(self.project.initiatives.count(), 1)
        self.assertEqual(self.project.initiatives.first(), self.initiative)
        self.assertEqual(self.other.initiatives.count(), 0)

    def test_custom_field_mapping(self):
        """Customize the fields expected in the JSON file."""

        with open(self.filename, 'w') as f:
            data = [
                {'proj': 'Test Project', 'init': 'Test Initiative'}
            ]
            json.dump(data, f)

        self.call_command(self.filename, project_field='proj', initiative_field='init')
        self.assertEqual(self.project.initiatives.count(), 1)
        self.assertEqual(self.project.initiatives.first(), self.initiative)
        self.assertEqual(self.other.initiatives.count(), 0)

    def test_already_mapped(self):
        """Skip associations which already exist."""

        self.project.initiatives.add(self.initiative)

        with open(self.filename, 'w') as f:
            data = [
                {'project_title': 'Test Project', 'initiative_name': 'Test Initiative'}
            ]
            json.dump(data, f)

        self.call_command(self.filename)
        self.assertEqual(self.project.initiatives.count(), 1)
        self.assertEqual(self.project.initiatives.first(), self.initiative)
        self.assertEqual(self.other.initiatives.count(), 0)

    def test_unkwown_project(self):
        """Skip project names which aren't found."""

        with open(self.filename, 'w') as f:
            data = [
                {'project_title': 'Test Project', 'initiative_name': 'Test Initiative'},
                {'project_title': 'Does Not Exist', 'initiative_name': 'Test Initiative'},
            ]
            json.dump(data, f)

        self.call_command(self.filename)
        self.assertEqual(self.project.initiatives.count(), 1)
        self.assertEqual(self.project.initiatives.first(), self.initiative)
        self.assertEqual(self.other.initiatives.count(), 0)

    def test_unknown_initiative(self):
        """Skip initiatives which aren't found."""

        with open(self.filename, 'w') as f:
            data = [
                {'project_title': 'Test Project', 'initiative_name': 'Test Initiative'},
                {'project_title': 'Test Project', 'initiative_name': 'Does Not Exist'},
            ]
            json.dump(data, f)

        self.call_command(self.filename)
        self.assertEqual(self.project.initiatives.count(), 1)
        self.assertEqual(self.project.initiatives.first(), self.initiative)
        self.assertEqual(self.other.initiatives.count(), 0)

    def test_blank_names(self):
        """Blank names are skipped."""

        with open(self.filename, 'w') as f:
            data = [
                {'project_title': '', 'initiative_name': 'Test Initiative'},
                {'project_title': 'Test Project', 'initiative_name': ''},
            ]
            json.dump(data, f)

        self.call_command(self.filename)
        self.assertEqual(self.project.initiatives.count(), 0)
        self.assertEqual(self.other.initiatives.count(), 0)
