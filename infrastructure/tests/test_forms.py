from django.http import QueryDict
from django.test import SimpleTestCase, TestCase

from ..forms import (
    PowerPlantForm,
    ProjectForm,
    InitiativeForm,
    MonthField,
    DayField,
)
from .factories import PowerPlantFactory, ProjectFactory


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

    def test_project_linear_length(self):
        data = {
            'name': 'Test Project Name',
            'slug': 'test-project-name',
            'linear_length': 32768,
        }
        with self.subTest("Length is too long"):
            form = ProjectForm(data)
            self.assertFalse(form.is_valid())
            self.assertIn('linear_length', form.errors)
        
        with self.subTest("Length is right"):
            data['linear_length'] = 32767
            form = ProjectForm(data)
            self.assertTrue(form.is_valid())
            self.assertNotIn('linear_length', form.errors)
        
        with self.subTest("No Length required"):
            data['linear_length'] = None
            form = ProjectForm(data)
            self.assertTrue(form.is_valid())
            self.assertNotIn('linear_length', form.errors)

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


class PowerPlantFormTestCase(TestCase):

    def test_powerplant_form_only_requires_name_and_slug(self):
        '''PowerPlantForm only requires name and slug values.'''
        data = {
            'name': 'Test Initiative Name',
            'slug': 'test-initiative-name',
        }
        form = PowerPlantForm(data)
        self.assertTrue(form.is_valid())

    def test_initial_projects(self):
        '''PowerPlantForm shows initial projects.'''
        with self.subTest('unsaved PowerPlant has no Projects'):
            data = {'name': 'Test PowerPlant Name', 'slug': 'test-powerplant-name'}
            form = PowerPlantForm(data)
            self.assertIsNone(form.initial.get('projects'))

        with self.subTest('saved PowerPlant with no Projects'):
            power_plant = PowerPlantFactory()
            form = PowerPlantForm(instance=power_plant)
            self.assertEqual(form.initial['projects'].count(), 0)

        with self.subTest('saved PowerPlant with Projects'):
            project1 = ProjectFactory()
            project2 = ProjectFactory()
            power_plant.project_set.add(project1, project2)
            form = PowerPlantForm(
                instance=power_plant,
                data={'name': power_plant.name, 'slug': power_plant.slug}
            )
            self.assertTrue(form.is_valid())
            self.assertEqual(
                set(form.initial['projects']),
                set([project1, project2])
            )

    def test_save_projects(self):
        '''PowerPlantForm correctly saves a PowerPlant's Projects.'''
        power_plant = PowerPlantFactory()
        project1 = ProjectFactory()
        project2 = ProjectFactory()

        with self.subTest('Adding projects with a QueryDict'):
            data = QueryDict(mutable=True)
            data.update({'name': power_plant.name, 'slug': power_plant.slug})
            data.update(projects=project1.id)
            data.update(projects=project2.id)
            form = PowerPlantForm(instance=power_plant, data=data)
            self.assertTrue(form.is_valid())
            updated_powerplant = form.save()

            self.assertEqual(
                set(updated_powerplant.project_set.all()),
                set([project1, project2])
            )

        with self.subTest('Removing Projects with a QueryDict'):
            data = QueryDict(mutable=True)
            data.update({'name': power_plant.name, 'slug': power_plant.slug})
            data.update(projects=project1.id)
            form = PowerPlantForm(instance=power_plant, data=data)
            self.assertTrue(form.is_valid())
            updated_powerplant = form.save()

            self.assertEqual(set(updated_powerplant.project_set.all()), set([project1]))

        with self.subTest('Adding projects with a dictionary'):
            data = {
                'name': power_plant.name,
                'slug': power_plant.slug,
                'projects': [project1, project2]
            }
            form = PowerPlantForm(instance=power_plant, data=data)
            self.assertTrue(form.is_valid())
            updated_powerplant = form.save()

            self.assertEqual(
                set(updated_powerplant.project_set.all()),
                set([project1, project2])
            )

        with self.subTest('Removing Projects with a dictionary'):
            data['projects'] = [project1]
            form = PowerPlantForm(instance=power_plant, data=data)
            self.assertTrue(form.is_valid())
            updated_powerplant = form.save()

            self.assertEqual(set(updated_powerplant.project_set.all()), set([project1]))
