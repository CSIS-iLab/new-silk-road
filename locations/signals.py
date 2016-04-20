from django.db.models.signals import m2m_changed
from django.dispatch import receiver

from locations.models import GeometryStore


@receiver(m2m_changed, sender=GeometryStore.lines.through)
@receiver(m2m_changed, sender=GeometryStore.points.through)
@receiver(m2m_changed, sender=GeometryStore.polygons.through)
def update_centroid_for_geostore(sender, instance, action, reverse, model, pk_set, using, **kwargs):
    if isinstance(instance, GeometryStore) and action in ('post_add', 'post_remove'):
        coll_centroid = instance._get_collection_centroid()
        if coll_centroid:
            instance.centroid = coll_centroid
            instance.save(update_fields=('centroid',))
