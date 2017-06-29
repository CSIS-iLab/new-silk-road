from django.core.exceptions import ValidationError
from django.test import TestCase

from ..models import Data


class DataModelTestCase(TestCase):
    """Flexible data store model."""

    def test_empty_data(self):
        """Data model can be empty."""

        data = Data.objects.create(dictionary={}, label='', url='')
        self.assertEqual(str(data), str(data.pk))

    def test_data_label(self):
        """Data can be associated with a label."""

        data = Data.objects.create(dictionary={}, label='My Label', url='')
        self.assertEqual(str(data), 'My Label')

    def test_data_url(self):
        """Data can be associated with a url."""

        data = Data.objects.create(dictionary={}, label='', url='http://example.com')
        self.assertEqual(str(data), 'http://example.com')

    def test_validate_url(self):
        """Model validation will reject invalid urls."""

        invalid = (
            None,
            'adfafd',
            '1232232',
            'ws://example.com',
            123122323,
            [],
        )

        for value in invalid:
            data = Data(dictionary={}, label='Test', url=value)
            with self.assertRaises(ValidationError):
                data.full_clean()
