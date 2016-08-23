from elasticsearch_dsl import Search
from search.serializers import EntrySerializer
from .factories import EntryFactory
from .base import BaseSearchTestCase


class DocumentsTestCase(BaseSearchTestCase):

    def test_index_writings_entries(self):
        entry_objects = EntryFactory.create_batch(30)
        serializer = EntrySerializer()
        for obj in entry_objects:
            doc_obj = serializer.create_document(obj)
            doc_obj.save()

        self.index.refresh()
        s = Search()

        self.assertEqual(len(entry_objects), s.count())

    def test_serialize_entry(self):
        entry = EntryFactory.create()
        serializer = EntrySerializer()
        doc_obj = serializer.create_document(entry)
        doc_obj.save()

        self.index.refresh()
        s = Search()
        response = s.execute()
        result = response[0]

        self.assertEqual(1, s.count())
        self.assertEqual(entry.id, result._app.id)
        self.assertEqual(entry.publication_date.isoformat(), result.publication_date)
        self.assertEqual(entry._meta.label, result._app.label)

    def test_delete_entry(self):
        entry = EntryFactory.create(title='Test title')
        serializer = EntrySerializer()
        doc_obj = serializer.create_document(entry)
        doc_obj.save()

        self.index.refresh()

        fetched_doc = serializer.doc_type.get(id=doc_obj._id)
        fetched_doc.delete()

        self.index.refresh()

        s = Search().query('match', title='Test title')
        s.execute()

        self.assertEqual(0, s.count())
        self.assertEqual(doc_obj._id, fetched_doc._id)
