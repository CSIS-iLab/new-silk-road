from locations.models import GeometryStore


def update_centroid_for_geostore(sender, instance, action, reverse, model, pk_set, using, **kwargs):
    if isinstance(instance, GeometryStore) and action in ('post_add', 'post_remove'):
        coll_centroid = instance._get_collection_centroid()
        if coll_centroid:
            instance.centroid = coll_centroid
            instance.save(update_fields=('centroid',))
