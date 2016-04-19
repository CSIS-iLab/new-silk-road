from django.apps import AppConfig


class LocationsConfig(AppConfig):
    name = 'locations'

    def ready(self):
        # from locations.signals import update_centroid_for_geostore
        import locations.signals
        # logger.debug('Locations ready')
        # request_finished.connect(my_callback)
        # GeometryStore = self.get_model('GeometryStore')
        # m2m_changed.connect(update_centroid_for_geostore, sender=GeometryStore.points.through)
