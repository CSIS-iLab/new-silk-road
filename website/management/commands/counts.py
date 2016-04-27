from django.core.management.base import AppCommand


class Command(AppCommand):

    def handle_app_config(self, app_config, **kwargs):
        models = app_config.get_models()
        for m in sorted(models, key=lambda x: str.lower(x._meta.model_name)):
            self.stdout.write('{:>9d} {}'.format(m.objects.count(), m._meta.object_name))
