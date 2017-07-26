from datetime import date

from django.core.exceptions import ValidationError 
from django.test import SimpleTestCase

from utilities.date import fuzzydate
from utilities.string import clean_string
from utilities.templatetags.date_extras import fuzzydate_filter
from utilities.validators import URLLikeValidator


class FuzzyDateTestCase(SimpleTestCase):

    def test_fuzzydate_accepts_positional_args(self):
        fd = fuzzydate(1776, 7, 4)
        self.assertEqual(fd.year, 1776)
        self.assertEqual(fd.month, 7)
        self.assertEqual(fd.day, 4)

    def test_fuzzydate_can_raise_error_on_invalid_day(self):
        with self.assertRaises(ValueError):
            fuzzydate(day=0, raise_errors=True)

        with self.assertRaises(ValueError):
            fuzzydate(day=32, raise_errors=True)

    def test_fuzzydate_invalid_day_is_none(self):
        d1 = fuzzydate(day=0)
        self.assertIsNone(d1.day)

        d2 = fuzzydate(day=32)
        self.assertIsNone(d2.day)

        d3 = fuzzydate(month=1, day=32)
        self.assertIsNone(d3.day)

        d4 = fuzzydate(month=1, day=32, year=2000)
        self.assertIsNone(d4.day)

    def test_fuzzydate_can_raise_error_on_invalid_month(self):
        with self.assertRaises(ValueError):
            fuzzydate(month=0, raise_errors=True)

        with self.assertRaises(ValueError):
            fuzzydate(month=13, raise_errors=True)

    def test_fuzzydate_invalid_month_is_none(self):
        d1 = fuzzydate(month=0)
        self.assertIsNone(d1.month)

        d2 = fuzzydate(month=13)
        self.assertIsNone(d2.month)

    def test_fuzzydate_creates_year_only_instance(self):
        fd = fuzzydate(1776)
        self.assertEqual(fd.year, 1776)
        self.assertIsNone(fd.month)
        self.assertIsNone(fd.day)

    def test_fuzzydate_fillin_works_with_actual_date(self):
        fd = fuzzydate(1776)
        fillin_date = date(2016, 7, 4)
        id4_date = fd.fillin(fillin_date)
        self.assertEqual(id4_date.year, 1776)
        self.assertEqual(id4_date.month, 7)
        self.assertEqual(id4_date.day, 4)

    def test_fuzzydate_can_raise_error_when_date_would_be_invalid(self):
        """fuzzydate can raise an error on fuzzydate(2015, 2, 29, raise_errors=True)

        2015 was not a leap year."""

        with self.assertRaises(ValueError):
            fuzzydate(2015, 2, 29, raise_errors=True)

        fd = fuzzydate(2015, 2, 29, raise_errors=False)
        self.assertIsNone(fd.day)

        # 2016 was a leap year and shouldn't generate an error
        fuzzydate(2016, 2, 29, raise_errors=True)

    def test_fuzzydate_fillin_raises_error_when_date_would_be_invalid(self):
        """fuzzydate.fillin should raise an error when the fillin would create an invalid date."""

        fd = fuzzydate(month=2, day=29)
        fillin_date = date(2015, 7, 4)
        with self.assertRaises(ValueError):
            fd.fillin(fillin_date)

    def test_fuzzydate_raises_error_on_invalid_month_when_raise_errors_is_true(self):
        with self.assertRaises(ValueError):
            fuzzydate(2001, 13, 1, raise_errors=True)

    def test_fuzzydate_raises_error_on_invalid_day_when_raise_errors_is_true(self):
        with self.assertRaises(ValueError):
            fuzzydate(2001, 1, 98, raise_errors=True)

    def test_fuzzydate_fillin_error_on_invalid_arg(self):
        """Value given to fillin must be a date."""

        fd = fuzzydate(month=2, day=29)
        for invalid in (1, 'XXX', None, 1.1):
            with self.subTest('Invalid fillin: {}'.format(invalid)):
                with self.assertRaises(TypeError):
                    fd.fillin(invalid)

    def test_fuzzydate_sets_invalid_month_to_none(self):
        fd = fuzzydate(2001, 13, 1)
        self.assertIsNone(fd.month)

    def test_fuzzydate_sets_invalid_day_to_none(self):
        fd = fuzzydate(2001, 1, 98)
        self.assertIsNone(fd.day)

    def test_fuzzydate_sets_invalid_month_and_day_to_none(self):
        fd = fuzzydate(2001, 32, 86)
        self.assertIsNone(fd.month)
        self.assertIsNone(fd.day)

    def test_fuzzydate_equality(self):
        """Fuzzy dates are equal if all set values are equal."""

        with self.subTest('Day'):
            self.assertEqual(fuzzydate(day=10), fuzzydate(day=10))
            self.assertNotEqual(fuzzydate(day=10), fuzzydate(day=1))
            self.assertNotEqual(fuzzydate(month=1, day=10), fuzzydate(day=10))

        with self.subTest('Month'):
            self.assertEqual(fuzzydate(month=10), fuzzydate(month=10))
            self.assertNotEqual(fuzzydate(month=10), fuzzydate(month=1))
            self.assertNotEqual(fuzzydate(month=1, day=10), fuzzydate(month=1))
            self.assertEqual(fuzzydate(month=1, day=10), fuzzydate(month=1, day=10))

        with self.subTest('Year'):
            self.assertEqual(fuzzydate(year=2000), fuzzydate(year=2000))
            self.assertNotEqual(fuzzydate(year=2000), fuzzydate(year=2001))
            self.assertNotEqual(fuzzydate(month=1, year=2000), fuzzydate(year=2000))
            self.assertEqual(fuzzydate(month=1, year=2000), fuzzydate(month=1, year=2000))
            self.assertNotEqual(fuzzydate(month=1, year=2000), fuzzydate(month=10, year=2000))

        with self.subTest('All'):
            self.assertEqual(
                fuzzydate(month=1, day=1, year=2000), fuzzydate(month=1, day=1, year=2000))
            self.assertNotEqual(
                fuzzydate(month=2, day=1, year=2000), fuzzydate(month=1, day=1, year=2000))
            self.assertNotEqual(
                fuzzydate(month=1, day=2, year=2000), fuzzydate(month=1, day=1, year=2000))
            self.assertNotEqual(
                fuzzydate(month=1, day=1, year=2000), fuzzydate(month=1, day=1, year=2001))
            self.assertNotEqual(
                fuzzydate(month=1, day=1, year=2000), fuzzydate(month=1, year=2000))

    def test_repr(self):
        """fuzzydate should have a readable repr."""

        self.assertEqual(repr(fuzzydate(month=1, day=31, year=2000)), 'fuzzydate(2000, 1, 31)')


class FuzzyDateFilterTestCase(SimpleTestCase):

    def test_fuzzydate_filter_handles_month_only(self):
        date_str = fuzzydate_filter(fuzzydate(month=12), 'N d Y')
        self.assertEqual('Dec.', date_str)

    def test_fuzzydate_filter_handles_day_only(self):
        date_str = fuzzydate_filter(fuzzydate(day=31), 'N d Y')
        self.assertEqual('31', date_str)

    def test_fuzzydate_filter_handles_day_year(self):
        date_str = fuzzydate_filter(fuzzydate(year=1997), 'N d Y')
        self.assertEqual('1997', date_str)

    def test_fuzzydate_filter_handles_month_day(self):
        date_str = fuzzydate_filter(fuzzydate(month=12, day=31), 'N d Y')
        self.assertIn('31', date_str.split())
        self.assertIn('Dec.', date_str.split())

    def test_fuzzydate_filter_and_fuzzydate_handle_invalid_dates(self):
        date_str = fuzzydate_filter(fuzzydate(month=2, day=42), 'N d Y')
        self.assertEqual('Feb.', date_str)

    def test_fuzzydate_filter_non_fuzzydate(self):
        for invalid in (1, 'XXX', None, 1.1, date(2001, 1, 31), fuzzydate(month=2, day=31), ):
            self.assertIsNone(fuzzydate_filter(invalid, 'N d Y'))


class CleanStringTestCase(SimpleTestCase):
    """Clean up smart quotes from strings."""

    def test_replace_unicode_quotes(self):
        """Unicode left and right quotes should be replaced by single quotes."""

        self.assertEqual(clean_string('This is \u2018great\u2019'), 'This is \'great\'')

    def test_replace_question_marks(self):
        """Question marks should converted to dashes."""

        self.assertEqual(clean_string('Why?'), 'Why–')

    def test_strip_quotes(self):
        """Optionally quotes are stripped."""

        self.assertEqual(clean_string('\'ok\''), 'ok')
        self.assertEqual(clean_string('\'ok\'', stripquotes=False), '\'ok\'')
        self.assertEqual(clean_string('"ok"'), 'ok')
        self.assertEqual(clean_string('"ok"', stripquotes=False), '"ok"')

    def test_strip_newlines(self):
        """Optionally newlines are stripped."""

        self.assertEqual(clean_string('Hello\nWorld'), 'Hello World')
        self.assertEqual(clean_string('Hello\nWorld', stripnewlines=False), 'Hello\nWorld')
        self.assertEqual(clean_string('Hello\rWorld'), 'Hello World')
        self.assertEqual(clean_string('Hello\rWorld', stripnewlines=False), 'Hello\rWorld')

    def test_default_value(self):
        """Default value is used for non-string arguments."""

        self.assertEqual(clean_string(None), '')
        self.assertEqual(clean_string(None, default='blip'), 'blip')
        self.assertEqual(clean_string(1.0), '')
        self.assertEqual(clean_string(1.0, default='invalid'), 'invalid')

    def test_trim_whitespace(self):
        """Leading, trailing, and double spaces are removed."""

        self.assertEqual(clean_string('    I love spaces'), 'I love spaces')
        self.assertEqual(clean_string('I love spaces    '), 'I love spaces')
        self.assertEqual(clean_string('I     love     spaces'), 'I love spaces')


class URLLikeValidatorTestCase(SimpleTestCase):
    """Flexible URL validation."""

    def test_valid_urls(self):
        """Valid URLs examples."""

        valid = (
            'http://example.com',
            'https://example.com/about/',
            'ftp://127.0.0.1/',
            # FIXME: IPv6 validation incorrect
            # 'ftp://::1/',
            'https://example.com/about/?something=else',
            'sftp://ftp.com/',
        )

        validator = URLLikeValidator()

        for value in valid:
            with self.subTest(value):
                self.assertIsNone(validator(value))

    def test_invalid_urls(self):
        """Invalid URL examples."""

        invalid = (
            # No scheme
            'example.com',
            # Invalid scheme
            'htp://example.com',
            # Invalid host
            'https://ecom/about/',
            # Invalid IP
            # FIXME: This is currently treated as a valid "domain" by the regex
            # 'ftp://1200.1.1.1/',
            # Random string
            'this is not a url',
            # Non-string values
            None,
            1,
            1.0,
        )

        validator = URLLikeValidator()

        for value in invalid:
            with self.subTest(value):
                self.assertRaises(ValidationError, validator, value)
