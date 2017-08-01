from unittest import mock

from django.test import TestCase

from ..templatetags import html_utils


@mock.patch('website.templatetags.html_utils.bleach.clean')
class HtmlTextTestCase(TestCase):
    """Test case for the html_text template tag."""

    def test_empty_string(self, mock_bleach_clean):
        """Calling html_text() with an empty string."""
        empty_string = ''
        html_utils.html_text(empty_string)
        # Bleach.clean was called with the value, strip=True, and the default tags
        self.assertTrue(mock_bleach_clean.called)
        args = mock_bleach_clean.call_args_list[0][0]
        kwargs = mock_bleach_clean.call_args_list[0][1]
        self.assertEqual(args[0], empty_string)
        self.assertEqual(kwargs['strip'], True)
        self.assertEqual(kwargs['tags'], html_utils.TEXT_TAGS.split(','))

    def test_tags_in_default_list(self, mock_bleach_clean):
        """Calling html_text() with tags in the default list."""
        text = '<p>This is a paragraph.</p>'
        html_utils.html_text(text)
        # Bleach.clean was called with the text, strip=True, and the default tags
        self.assertTrue(mock_bleach_clean.called)
        args = mock_bleach_clean.call_args_list[0][0]
        kwargs = mock_bleach_clean.call_args_list[0][1]
        self.assertEqual(args[0], text)
        self.assertEqual(kwargs['strip'], True)
        self.assertEqual(kwargs['tags'], html_utils.TEXT_TAGS.split(','))

    def test_tags_not_in_list(self, mock_bleach_clean):
        """Calling html_text() with tags not in the default list."""
        text = '<div>This is a div.</div>'
        html_utils.html_text(text)
        # Bleach.clean was called with the text, strip=True, and the default tags
        self.assertTrue(mock_bleach_clean.called)
        args = mock_bleach_clean.call_args_list[0][0]
        kwargs = mock_bleach_clean.call_args_list[0][1]
        self.assertEqual(args[0], text)
        self.assertEqual(kwargs['strip'], True)
        self.assertEqual(kwargs['tags'], html_utils.TEXT_TAGS.split(','))

    def test_specified_tags(self, mock_bleach_clean):
        """Calling html_text() and specifying tags calls bleac.clean() with those tags."""
        with self.subTest('Valid tags'):
            custom_tags = 'p,div'
            text = '<div>This is a div.</div>'
            html_utils.html_text(text, custom_tags)
            # Bleach.clean was called with the text, strip=True, and the custom_tags
            self.assertTrue(mock_bleach_clean.called)
            args = mock_bleach_clean.call_args_list[0][0]
            kwargs = mock_bleach_clean.call_args_list[0][1]
            self.assertEqual(args[0], text)
            self.assertEqual(kwargs['strip'], True)
            self.assertEqual(kwargs['tags'], custom_tags.split(','))

        with self.subTest('Invalid tags'):
            custom_tags = 'notavalidtag,p'
            html_utils.html_text(text, custom_tags)
            # Bleach.clean was called with the text, strip=True, and the custom_tags
            self.assertTrue(mock_bleach_clean.called)
            args = mock_bleach_clean.call_args_list[1][0]
            kwargs = mock_bleach_clean.call_args_list[1][1]
            self.assertEqual(args[0], text)
            self.assertEqual(kwargs['strip'], True)
            self.assertEqual(kwargs['tags'], custom_tags.split(','))

    # html_utils.html_text(value, tags)
