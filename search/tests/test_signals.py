from unittest.mock import patch

from django.test import SimpleTestCase

from facts.models import Organization

from ..signals import run_post_save_search_tasks, run_post_delete_search_tasks
from ..tasks import handle_model_post_save, handle_model_post_delete


class SaveSignalHandlersTestCase(SimpleTestCase):

    @patch('django_rq.enqueue')
    def test_post_create(self, mock_enqueue):
        """Search tasks should be queued after model creation."""

        instance = Organization(id=1)
        run_post_save_search_tasks(
            sender=Organization, instance=instance,
            created=True, update_fields=None, raw=False, using=None)
        mock_enqueue.assert_called_once_with(
            handle_model_post_save, 'facts.Organization', 1)

    @patch('django_rq.enqueue')
    def test_post_save(self, mock_enqueue):
        """Search tasks should be queued after model save."""

        instance = Organization(id=2)
        run_post_save_search_tasks(
            sender=Organization, instance=instance,
            created=False, update_fields=('name', ), raw=False, using=None)
        mock_enqueue.assert_called_once_with(
            handle_model_post_save, 'facts.Organization', 2)

    @patch('django_rq.enqueue')
    def test_invalid_save_sender(self, mock_enqueue):
        """Skip task if save sender doesn't look like Django Model."""

        instance = Organization(id=2)
        run_post_save_search_tasks(
            sender=None, instance=instance,
            created=False, update_fields=('name', ), raw=False, using=None)
        self.assertFalse(mock_enqueue.called)

    @patch('django_rq.enqueue')
    def test_post_delete(self, mock_enqueue):
        """Removal tasks should be queued after model delete."""

        instance = Organization(id=3)
        run_post_delete_search_tasks(
            sender=Organization, instance=instance, useing=None)
        mock_enqueue.assert_called_once_with(
            handle_model_post_delete, 'facts.Organization', 3)

    @patch('django_rq.enqueue')
    def test_invalid_delete_sender(self, mock_enqueue):
        """Skip task if delete sender doesn't look like Django Model."""

        instance = Organization(id=3)
        run_post_delete_search_tasks(
            sender=None, instance=instance, useing=None)
        self.assertFalse(mock_enqueue.called)
