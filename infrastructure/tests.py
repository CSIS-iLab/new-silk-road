from django.test import SimpleTestCase
from .forms import (
    ProjectForm,
    InitiativeForm,
    MonthField,
    DayField,
)


class FormFieldTestCase(SimpleTestCase):

    def test_monthfield(self):
        self.assertFieldOutput(
            MonthField,
            {'12': 12},
            {'14': ['Ensure this value is less than or equal to 12.']},
            empty_value=None
        )

    def test_monthfield_has_default_help_text(self):
        field = MonthField()
        self.assertEqual(
            field.help_text,
            'Enter a whole number representing the month (1-12)'
        )

    def test_monthfield_default_help_text_is_overridable(self):
        field = MonthField(help_text='Help text override')
        self.assertEqual(
            field.help_text,
            'Help text override'
        )

    def test_dayfield(self):
        self.assertFieldOutput(
            DayField,
            {'1': 1},
            {'42': ['Ensure this value is less than or equal to 31.']},
            empty_value=None
        )

    def test_dayfield_has_default_help_text(self):
        field = DayField()
        self.assertEqual(
            field.help_text,
            'Enter a whole number representing a day in the range 1-31'
        )

    def test_dayfield_default_help_text_is_overridable(self):
        field = DayField(help_text='Help text override')
        self.assertEqual(
            field.help_text,
            'Help text override'
        )


class ProjectFormTestCase(SimpleTestCase):

    def test_project_form_only_requires_name_and_slug(self):
        '''ProjectForm only requires name and slug values.'''
        data = {
            'name': 'Test Project Name',
            'slug': 'test-project-name',
        }
        form = ProjectForm(data)
        self.assertTrue(form.is_valid())

    def test_project_form_raises_errors_on_invalid_month(self):
        '''ProjectForm raises an error on an invalid month.'''
        data = {
            'name': 'Test Project Name',
            'slug': 'test-project-name',
            'start_month': 42,
            'commencement_month': 42,
            'planned_completion_month': 42,
        }
        form = ProjectForm(data)

        self.assertFalse(form.is_valid())
        self.assertIn('start_month', form.errors)
        self.assertListEqual(form.errors['start_month'], ['Ensure this value is less than or equal to 12.'])
        self.assertIn('commencement_month', form.errors)
        self.assertListEqual(form.errors['commencement_month'], ['Ensure this value is less than or equal to 12.'])
        self.assertIn('planned_completion_month', form.errors)
        self.assertListEqual(form.errors['planned_completion_month'], ['Ensure this value is less than or equal to 12.'])

    def test_project_form_raises_errors_on_invalid_day(self):
        '''ProjectForm raises an error on an invalid day.'''
        data = {
            'name': 'Test Project Name',
            'slug': 'test-project-name',
            'start_day': 100,
            'commencement_day': 100,
            'planned_completion_day': 100,
        }
        form = ProjectForm(data)

        self.assertFalse(form.is_valid())
        self.assertIn('start_day', form.errors)
        self.assertListEqual(form.errors['start_day'], ['Ensure this value is less than or equal to 31.'])
        self.assertIn('commencement_day', form.errors)
        self.assertListEqual(form.errors['commencement_day'], ['Ensure this value is less than or equal to 31.'])
        self.assertIn('planned_completion_day', form.errors)
        self.assertListEqual(form.errors['planned_completion_day'], ['Ensure this value is less than or equal to 31.'])


class InitiativeFormTestCase(SimpleTestCase):

    def test_initiative_form_only_requires_name_and_slug(self):
        '''InitiativeForm only requires name and slug values.'''
        data = {
            'name': 'Test Initiative Name',
            'slug': 'test-initiative-name',
        }
        form = InitiativeForm(data)
        self.assertTrue(form.is_valid())

    def test_initiative_form_raises_errors_on_invalid_month(self):
        '''InitiativeForm raises an error on an invalid month.'''
        data = {
            'name': 'Test Initiative Name',
            'slug': 'test-initiative-name',
            'founding_month': 42,
            'appeared_month': 42,
        }
        form = InitiativeForm(data)

        self.assertFalse(form.is_valid())
        self.assertIn('founding_month', form.errors)
        self.assertListEqual(form.errors['founding_month'], ['Ensure this value is less than or equal to 12.'])
        self.assertIn('appeared_month', form.errors)
        self.assertListEqual(form.errors['appeared_month'], ['Ensure this value is less than or equal to 12.'])

    def test_initiative_form_raises_errors_on_invalid_day(self):
        '''InitiativeForm raises an error on an invalid day.'''
        data = {
            'name': 'Test Initiative Name',
            'slug': 'test-initiative-name',
            'founding_day': 100,
            'appeared_day': 100,
        }
        form = InitiativeForm(data)

        self.assertFalse(form.is_valid())
        self.assertIn('founding_day', form.errors)
        self.assertListEqual(form.errors['founding_day'], ['Ensure this value is less than or equal to 31.'])
        self.assertIn('appeared_day', form.errors)
        self.assertListEqual(form.errors['appeared_day'], ['Ensure this value is less than or equal to 31.'])
