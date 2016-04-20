from django.apps import AppConfig
from django.db.models.signals import m2m_changed


class LocationsConfig(AppConfig):
    name = 'locations'

    def ready(self):
        GeometryStore = self.get_model('GeometryStore')
        from locations.signals import update_centroid_for_geostore
        m2m_changed.connect(update_centroid_for_geostore, sender=GeometryStore.lines.through)
        m2m_changed.connect(update_centroid_for_geostore, sender=GeometryStore.points.through)
        m2m_changed.connect(update_centroid_for_geostore, sender=GeometryStore.polygons.through)
