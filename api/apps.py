from django.apps import AppConfig


class ApiConfig(AppConfig):
    name = 'api'

    def ready(self):
        # This import ensures that the maintenancemode settings are patched by AppConf when starting up the tests
        from maintenancemode.conf import MaintenanceSettings
