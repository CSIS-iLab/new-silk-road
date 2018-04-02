from django.test import TestCase

from filer.models import File

from .models import Document


class DocumentTestCase(TestCase):
    """Models to store document file references."""

    def test_str(self):
        """String repr should use the original file name if available."""

        source = File.objects.create()
        doc = Document(source_file=source)

        with self.subTest('Not saved (no filename)'):
            self.assertEqual(str(doc), 'Unsaved Document')

        with self.subTest('No filename'):
            doc.save()
            self.assertEqual(str(doc), 'Document #{}'.format(doc.id))

        with self.subTest('Has a filename'):
            source.original_filename = 'test.png'
            doc.refresh_from_db()
            self.assertEqual(str(doc), 'test.png')
