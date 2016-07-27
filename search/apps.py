from django.apps import AppConfig


class SearchConfig(AppConfig):
    name = 'search'

    # def ready(self):
    #     GeometryStore = self.get_model('GeometryStore')
    #     from locations.signals import update_centroid_for_geostore
    #     m2m_changed.connect(update_centroid_for_geostore, sender=GeometryStore.lines.through)
    #     m2m_changed.connect(update_centroid_for_geostore, sender=GeometryStore.points.through)
    #     m2m_changed.connect(update_centroid_for_geostore, sender=GeometryStore.polygons.through)
