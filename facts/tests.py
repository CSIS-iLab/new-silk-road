from django.test import TestCase
from facts.models import Person
from facts.admin import PersonForm


class PersonFormTestCase(TestCase):

    def test_person_form_handles_citizenships(self):
        f = PersonForm({
            'given_name': 'Jane',
            'family_name': 'Worldtraveller',
            'name_order': 1,
            'citizenship': ['840', '729', '112']
        })

        self.assertTrue(f.is_valid())


class PersonModelTestCase(TestCase):

    def test_person_has_citizenships(self):
        p = Person(given_name='Jane', citizenship=[Person.COUNTRY_CHOICES[2][0], Person.COUNTRY_CHOICES[4][0]])
        p.save()

        self.assertIn(Person.COUNTRY_CHOICES[2][0], p.citizenship)
        self.assertIn(Person.COUNTRY_CHOICES[4][0], p.citizenship)
