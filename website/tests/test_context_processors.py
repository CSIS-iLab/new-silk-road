from unittest import mock

from django.conf import settings
from django.test import TestCase

from ..context_processors import analytics


class AnalyticsTestCase(TestCase):
    """Test case for the analytics context_processor."""
    def test_google_analytics_key(self):
        """The GOOGLE_ANALYTICS_KEY depends on the DEBUG setting."""
        mock_request = mock.Mock()

        with self.subTest('DEBUG is False'):
            self.assertFalse(settings.DEBUG)
            result = analytics(mock_request)
            self.assertEqual(
                result,
                {'GOOGLE_ANALYTICS_KEY': settings.GOOGLE_ANALYTICS_KEY}
            )

        with self.subTest('DEBUG is True'):
            with self.settings(DEBUG=True):
                self.assertTrue(settings.DEBUG)
                result = analytics(mock_request)
                self.assertEqual(result, {'GOOGLE_ANALYTICS_KEY': None})
