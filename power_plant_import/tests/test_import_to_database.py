from django.test import TestCase

from infrastructure.models import PowerPlant, Project
from .. import import_csv_to_database


class ImportCSVToDatabaseTestCase(TestCase):
    """Test case for the import_csv_to_database() function."""

    def test_invalid_type(self):
        """Having an invalid PowerPlant/Project 'Type' throws an error."""

        import_csv_to_database.import_csv_to_database(
            '--filename=power_plant_import/tests/data/invalid_type.csv',
        )
        # No PowerPlants or Projects were created during the test
        self.assertEqual(PowerPlant.objects.count(), 0)
        self.assertEqual(Project.objects.count(), 0)
