from unittest.mock import patch

from django.test import SimpleTestCase

from ..apps import SearchAppConfig
from ..signals import run_post_save_search_tasks, run_post_delete_search_tasks


class SearchAppConfigTestCase(SimpleTestCase):
    """Application initialization logic."""

    @patch('search.tasks.schedule_periodic_index_rebuilds')
    @patch('search.apps.post_delete')
    @patch('search.apps.post_save')
    def test_register_signal_handlers(self, mock_post_save, mock_post_delete, mock_rebuild):
        """post_save and post_delete handlers should be registered on application ready."""

        conf = SearchAppConfig.create('search')
        with self.settings(SEARCH_SIGNALS=True):
            conf.ready()
            models = (
                'facts.Event',
                'facts.Organization',
                'facts.Person',
                'infrastructure.Initiative',
                'infrastructure.Project',
                'writings.Entry',
            )
            for label in models:
                with self.subTest(label):
                    mock_post_save.connect.assert_any_call(
                        run_post_save_search_tasks,
                        sender=label,
                        dispatch_uid='run_post_save_search_tasks::{}'.format(label),
                    )
                    mock_post_delete.connect.assert_any_call(
                        run_post_delete_search_tasks,
                        sender=label,
                        dispatch_uid='run_post_delete_search_tasks::{}'.format(label),
                    )

    @patch('search.tasks.schedule_periodic_index_rebuilds')
    @patch('search.apps.post_delete')
    @patch('search.apps.post_save')
    def test_queue_rebuild(self, mock_post_save, mock_post_delete, mock_rebuild):
        """Queue the periodic rebuild on ready."""

        conf = SearchAppConfig.create('search')
        with self.subTest('Successful'):
            conf.ready()
            mock_rebuild.assert_called_once_with()

        with self.subTest('Error'):
            # Exceptions should be hidden
            mock_rebuild.reset_mock()
            mock_rebuild.side_effect = Exception
            conf.ready()
            mock_rebuild.assert_called_once_with()
