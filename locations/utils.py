from django.contrib.gis.gdal import DataSource
from locations.models import (
    GeometryStore,
)
from utilities.string import clean_string
import logging

logger = logging.getLogger(__name__)

LABEL_CHAR_LIMIT = 400


def geostore_from_file(source, label, verbosity=0, geo_attributes={}, create=True):
    try:
        ds = DataSource(source)
    except Exception as e:
        logger.error(str(e))
        raise e

    geo_store = None
    if create:
        geo_store = GeometryStore.objects.create(label=label[:LABEL_CHAR_LIMIT], attributes=geo_attributes)
    else:
        logger.info('Processing, but not saving geodata')

    if verbosity > 2:
        logger.info('3D geometries will be flattened!')

    for layer in ds:
        layer_name = layer.name.split('.')[0]
        if verbosity > 2:
            logger.info('Layer "{}": {} {}s'.format(layer_name, len(layer), layer.geom_type.name))
        for feat in layer:
            # Remove 3rd dimension
            geom = feat.geom.clone()
            geom.coord_dim = 2
            if create:
                # Create attributes dict from geom fields
                data = {f.name.lower(): f.value for f in feat}
                if 'name' in data:
                    data['name'] = clean_string(data['name'])
                # Add source information to attributes
                data['layer'] = layer_name
                if verbosity > 2:
                    logger.info('Feature "{}": {}'.format(data.get('name', layer_name), feat.geom_type))

                if geom.geos:
                    geom_label = data.get('name') or "{}: {}".format(label, layer_name)
                    params = {
                        'label': geom_label[:LABEL_CHAR_LIMIT],
                        'geom': geom.geos,
                        'attributes': data
                    }
                    if geo_store and create:
                        if geom.geom_type == 'Point':
                            geo_store.points.create(**params)
                        elif geom.geom_type == 'LineString':
                            geo_store.lines.create(**params)
                        elif geom.geom_type == 'Polygon':
                            geo_store.polygons.create(**params)
                        if verbosity > 1:
                            logger.info("Geometry '{}' found and saved".format(geom_label))
                    elif verbosity > 1:
                        logger.info("Geometry '{}' found, but not saved".format(geom_label))

    return geo_store
