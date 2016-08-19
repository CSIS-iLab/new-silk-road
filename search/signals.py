from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
import logging
from search.tasks import handle_model_post_save

logger = logging.getLogger(__package__)


@receiver(post_save)
def run_post_save_search_tasks(sender, **kwargs):
    if hasattr(sender, '_meta'):
        instance = kwargs.get('instance')
        handle_model_post_save.delay(sender._meta.label, instance.id)


@receiver(post_delete)
def run_post_delete_search_tasks(sender, **kwargs):
    print('run_post_delete_search_tasks')
    print(sender)
