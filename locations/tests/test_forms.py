from django.test import SimpleTestCase

from ..forms import GeometryStoreForm


class GeometryStoreFormTestCase(SimpleTestCase):

    def test_geostore_form_only_requires_label(self):
        '''GeometryStoreForm only requires name and slug values.'''
        data = {'label': 'Test Geostore'}
        form = GeometryStoreForm(data)
        self.assertTrue(form.is_valid())
