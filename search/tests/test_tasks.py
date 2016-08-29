from elasticsearch_dsl import Search
from redis import Redis
from rq import SimpleWorker, Queue
from .base import BaseSearchTestCase
from search.tasks import (
    handle_model_post_save,
    save_to_search_index,
    handle_model_post_delete,
    remove_from_search_index,
    index_model,
)
from search.utils import calculate_doc_id
from .factories import (
    EntryFactory,
    ProjectFactory,
)


class TasksTestCase(BaseSearchTestCase):

    def setUp(self):
        super().setUp()

        self.queue = Queue('test', connection=Redis(), async=False)
        self.worker = SimpleWorker([self.queue], connection=self.queue.connection)

    def test_handle_model_post_save(self):
        # mocks.patch doesn't work with rq. Not sure how to test further
        entry = EntryFactory.create(published=True)
        job = self.queue.enqueue(handle_model_post_save, 'writings.Entry', entry.id)
        doc_id = calculate_doc_id('writings.Entry', entry.id)

        self.assertEqual(job.status, 'finished')
        self.assertEqual(job.return_value, doc_id)

    def test_save_to_search_index(self):
        entry = EntryFactory.create(published=True)
        job = self.queue.enqueue(save_to_search_index, 'writings.Entry', entry.id)
        doc_id = calculate_doc_id('writings.Entry', entry.id)

        self.assertEqual(job.status, 'finished')
        self.assertEqual(job.return_value, doc_id)

    def test_handle_model_post_delete(self):
        entry = EntryFactory.create(published=True)
        entry_id = entry.id
        doc_id = calculate_doc_id('writings.Entry', entry_id)

        save_job = self.queue.enqueue(save_to_search_index, 'writings.Entry', entry_id)

        self.assertEqual(save_job.status, 'finished')
        self.assertEqual(save_job.return_value, doc_id)

        entry.delete()
        job = self.queue.enqueue(handle_model_post_delete, 'writings.Entry', entry_id)

        self.assertEqual(job.status, 'finished')
        self.assertEqual(job.return_value, doc_id)

    def test_remove_from_search_index(self):
        entry = EntryFactory.create(published=True)
        entry_id = entry.id
        doc_id = calculate_doc_id('writings.Entry', entry_id)

        save_job = self.queue.enqueue(save_to_search_index, 'writings.Entry', entry_id)

        self.assertEqual(save_job.status, 'finished')
        self.assertEqual(save_job.return_value, doc_id)

        entry.delete()
        job = self.queue.enqueue(remove_from_search_index, 'writings.Entry', entry_id)

        self.assertEqual(job.status, 'finished')
        self.assertEqual(job.return_value, doc_id)

    def test_index_model(self):
        entry_objects = EntryFactory.create_batch(30, published=True)

        job = self.queue.enqueue(index_model, 'writings.Entry')

        self.assertEqual(job.result, (30, []))
        self.assertEqual(job.status, 'finished')

        self.index.refresh()
        s = Search()

        self.assertEqual(len(entry_objects), s.count())

    def test_index_model_fails_on_unregistered_model(self):
        with self.assertRaises(LookupError):
            job = self.queue.enqueue(index_model, 'auth.User')
            self.assertEqual(job.status, 'failed')

    def test_index_model_multiple_models(self):
        entry_objects = EntryFactory.create_batch(30, published=True)
        project_objects = ProjectFactory.create_batch(20, published=True)

        job = self.queue.enqueue(index_model, EntryFactory._meta.model._meta.label)

        self.assertEqual(job.result, (30, []))
        self.assertEqual(job.status, 'finished')

        job = self.queue.enqueue(index_model, ProjectFactory._meta.model._meta.label)

        self.assertEqual(job.result, (20, []))
        self.assertEqual(job.status, 'finished')

        self.index.refresh()
        s = Search()

        self.assertEqual(len(entry_objects) + len(project_objects), s.count())
