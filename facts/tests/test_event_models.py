from django.test import TestCase

from ..models import Event, EventType
from utilities.date import fuzzydate


class EventModelTestCase(TestCase):

    def test_minimal_event(self):
        """Events only need to have a name."""

        event = Event.objects.create(name='Minimal Event')
        self.assertEqual(str(event), 'Minimal Event')

    def test_event_slug(self):
        """Events are assigned a slug on creation."""

        event = Event.objects.create(name='My Test Event')
        self.assertEqual(event.slug, 'my-test-event')

    def test_event_start_date(self):
        """Events can track their start date."""

        with self.subTest('Only a start year'):
            event = Event.objects.create(name='Start Event', start_year=1989)
            self.assertEqual(event.fuzzy_start_date, fuzzydate(year=1989))

        with self.subTest('Start month and year'):
            event = Event.objects.create(
                name='Another Start Event', start_year=1989, start_month=12)
            self.assertEqual(event.fuzzy_start_date, fuzzydate(year=1989, month=12))

        with self.subTest('Full start date'):
            event = Event.objects.create(
                name='Final Start Event', start_year=1989, start_month=12, start_day=13)
            self.assertEqual(event.fuzzy_start_date, fuzzydate(year=1989, month=12, day=13))

    def test_event_end_date(self):
        """Events can track their end date."""

        with self.subTest('Only a end year'):
            event = Event.objects.create(name='End Event', end_year=1989)
            self.assertEqual(event.fuzzy_end_date, fuzzydate(year=1989))

        with self.subTest('End month and year'):
            event = Event.objects.create(
                name='Another End Event', end_year=1989, end_month=12)
            self.assertEqual(event.fuzzy_end_date, fuzzydate(year=1989, month=12))

        with self.subTest('Full end date'):
            event = Event.objects.create(
                name='Final End Event', end_year=1989, end_month=12, end_day=13)
            self.assertEqual(event.fuzzy_end_date, fuzzydate(year=1989, month=12, day=13))

    def test_event_type(self):
        """Events can have types assigned to them."""

        event_type = EventType.objects.create(name='Holiday')
        event = Event.objects.create(name='My Holiday', event_type=event_type)
        self.assertEqual(event.event_type, event_type)
        # Events are not delete if the type is removed
        event_type.delete()
        event.refresh_from_db()
        self.assertIsNone(event.event_type)

    def test_event_url(self):
        """Events have detail pages."""

        event = Event.objects.create(name='Big Event')
        self.assertEqual(event.get_absolute_url(), '/database/events/big-event/')
