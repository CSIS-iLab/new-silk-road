from django.contrib.gis.gdal import DataSource
from locations.models import (
    GeometryStore,
)
from datautils.string import clean_string


def geostore_from_file(source, label):
    try:
        ds = DataSource(source)
    except Exception as e:
        raise e

    geo_store = GeometryStore.objects.create(label=label)

    for layer in ds:
        layer_name = layer.name.split('.')[0]
        for feat in layer:
            # Remove 3rd dimension
            geom = feat.geom.clone()
            geom.coord_dim = 2
            if geo_store:
                # Create attributes dict from geom fields
                data = {f.name.lower(): f.value for f in feat}
                if 'name' in data:
                    data['name'] = clean_string(data['name'])
                # Add source information to attributes
                data['layer'] = layer_name

                if geom.geos:
                    geom_label = data.get('name') or "{}: {}".format(label, layer_name)
                    params = {
                        'label': geom_label,
                        'geom': geom.geos,
                        'attributes': data
                    }
                    if geom.geom_type == 'Point':
                        geo_store.points.create(**params)
                    elif geom.geom_type == 'LineString':
                        geo_store.lines.create(**params)
                    elif geom.geom_type == 'Polygon':
                        geo_store.polygons.create(**params)

    return geo_store
