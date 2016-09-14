from django.test import TestCase, override_settings
from elasticsearch_dsl.connections import connections
from redis import Redis
from rq import SimpleWorker, Queue
from django_rq import get_worker
from .base import BaseSearchTestCase
from search.tasks import (
    create_search_index,
    handle_model_post_save,
    save_to_search_index,
    handle_model_post_delete,
    remove_from_search_index,
    index_model,
    rebuild_indices,
)
from search.utils import calculate_doc_id
from .factories import (
    EntryFactory,
    ProjectFactory,
)
from .settings import TEST_SEARCH, TEST_RQ_QUEUES


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
        EntryFactory.create_batch(30, published=True)
        EntryFactory.create_batch(5, published=False)

        from django.conf import settings
        PUBLISH_FILTER_ENABLED = getattr(settings, 'PUBLISH_FILTER_ENABLED', True)

        job = self.queue.enqueue(index_model, 'writings.Entry')

        expected_model_index_count = 30 if PUBLISH_FILTER_ENABLED else 35

        self.assertEqual(job.result, (expected_model_index_count, []))
        self.assertEqual(job.status, 'finished')

        self.index.refresh()

        self.assertEqual(expected_model_index_count, self.search.count())

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

        self.assertEqual(len(entry_objects) + len(project_objects), self.search.count())


@override_settings(SEARCH=TEST_SEARCH)
class CreateSearchIndexTestCase(TestCase):

    def setUp(self):
        from django.conf import settings
        self.settings = getattr(settings, 'SEARCH')
        connections.create_connection('testing', **self.settings['default']['connections'])

    def test_create_search_index_only(self):
        index = create_search_index('test_create')

        self.assertIsNotNone(index)

        index_dict = index.to_dict()
        self.assertNotIn('mappings', index_dict)

        index.delete()
        self.assertFalse(index.exists())

    def test_create_search_index_with_doctypes(self):
        index = create_search_index('foo', doc_types=('search.tests.mocks.MockDocOne', 'search.tests.mocks.MockDocTwo'))

        self.assertIsNotNone(index)

        index_dict = index.to_dict()
        self.assertIn('mappings', index_dict)

        mappings = index_dict.get('mappings')
        self.assertEqual(len(mappings.keys()), 2)
        self.assertIn('mock_doc_one', mappings)
        self.assertIn('mock_doc_two', mappings)

        index.delete()
        self.assertFalse(index.exists())


@override_settings(RQ_QUEUES=TEST_RQ_QUEUES)
class RebuildIndexTestCase(BaseSearchTestCase):

    def setUp(self):
        super().setUp()
        self.published_entry_count = 102
        self.published_project_count = 101
        EntryFactory.create_batch(self.published_entry_count, published=True)
        ProjectFactory.create_batch(self.published_project_count, published=True)
        self.unpublished_entry_count = 14
        self.unpublished_project_count = 6
        EntryFactory.create_batch(self.unpublished_entry_count, published=False)
        ProjectFactory.create_batch(self.unpublished_project_count, published=False)

        from django.conf import settings
        self.SEARCH = getattr(settings, 'SEARCH')
        self.PUBLISH_FILTER_ENABLED = getattr(settings, 'PUBLISH_FILTER_ENABLED', True)

    def test_rebuild_indices(self):
        result = rebuild_indices(self.SEARCH)

        self.assertIsNotNone(result)
        self.assertIsInstance(result, dict)

        self.index.refresh()
        expected_index_count = self.published_entry_count + self.published_project_count
        if not self.PUBLISH_FILTER_ENABLED:
            expected_index_count += self.unpublished_entry_count + self.unpublished_project_count
        self.assertEqual(expected_index_count, self.search.count())

    def test_rebuild_indices_using_subtasks(self):
        result = rebuild_indices(self.SEARCH, subtask_indexing=True)
        get_worker().work(burst=True)

        self.assertIsNotNone(result)
        self.assertIsInstance(result, dict)

        self.index.refresh()
        expected_index_count = self.published_entry_count + self.published_project_count
        if not self.PUBLISH_FILTER_ENABLED:
            expected_index_count += self.unpublished_entry_count + self.unpublished_project_count
        self.assertEqual(expected_index_count, self.search.count())
