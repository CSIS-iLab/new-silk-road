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
from .factories import (
    EntryFactory,
)


class TasksTestCase(BaseSearchTestCase):

    def setUp(self):
        super().setUp()

        self.queue = Queue('test', connection=Redis())
        self.worker = SimpleWorker([self.queue], connection=self.queue.connection)

    def test_handle_model_post_save(self):

        self.fail()

    def test_save_to_search_index(self):

        self.fail()

    def test_handle_model_post_delete(self):

        self.fail()

    def test_remove_from_search_index(self):

        self.fail()

    def test_index_model(self):
        entry_objects = EntryFactory.create_batch(30, published=True)

        job = self.queue.enqueue(index_model, 'writings.Entry')
        self.worker.work(burst=True)  # Runs enqueued job

        self.assertEqual(job.result, (30, []))
        self.assertEqual(job.status, 'finished')

        self.index.refresh()
        s = Search()

        self.assertEqual(len(entry_objects), s.count())

    def test_index_model_fails_on_unregistered_model(self):
        job = self.queue.enqueue(index_model, 'auth.User')
        self.worker.work(burst=True)  # Runs enqueued job
        self.assertEqual(job.status, 'failed')
