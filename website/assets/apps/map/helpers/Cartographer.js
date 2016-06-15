import alt from '../alt';
import ActionListeners from 'alt-utils/lib/ActionListeners';
import MapboxGl, {
  Popup,
  GeoJSONSource
} from "mapbox-gl/js/mapbox-gl";
import GeoCentroidActions from '../actions/GeoCentroidActions';

const centroidsLayerId = 'project-centroids';
const centroidsSourceId = `${centroidsLayerId}-src`;

const geoStyles = {
  centroids: {
    type: 'symbol',
    layout: {
      'icon-allow-overlap': true,
      'icon-image': 'dot'
    },
    paint: {
      'icon-opacity': 1
    }
  },
  lines: {
    type: 'line',
    layout: {},
    paint: {
      'line-color': '#be2323',
      'line-width': 3
    }
  },
  points: {
    type: 'sy',
    layout: {},
    paint: {}
  },
  polygons: {
    type: 'fill',
    layout: {},
    paint: {
      'fill-color': '#be2323'
    }
  }
}

const defaultZoom = 2;
const maxFitZoom = 6;

class MapUtils {
  static createGeoJSONSource(config) {
    return new GeoJSONSource(config);
  }

  static createLayer(config) {
    const {
      sourceId,
      layerId,
      type,
      style
    } = config;
    return Object.assign({
      id: layerId,
      type: type,
      source: sourceId
    }, style || {});
  }
}

export default class Cartographer {

  constructor(map) {
    this._map = map;
    this._al = new ActionListeners(alt);
    this._layerRefs = new Set();
    this._sourceRefs = new Set();
    this._popup = null;
    this._addListeners();
  }

  _addListeners() {
    this._al.addActionListener(GeoCentroidActions.UPDATE, this._handleCentroidsUpdate.bind(this));
  }

  _handleCentroidsUpdate(data) {
    const config = {
      sourceId: centroidsSourceId,
      layerId: centroidsLayerId,
      style: geoStyles.centroids,
      type: 'symbol'
    };
    const source = MapUtils.createGeoJSONSource({
      data
    });
    const layer = MapUtils.createLayer(config);
    this.setSource(layer.source, source);
    this.addLayer(layer);
    this._removePopup();
    this._setPopupLayer(layer.id);
  }

  setSource(id, source, replace = true) {
    if (this._sourceRefs.has(id) && replace) {
      this._map.removeSource(id);
    }
    this._sourceRefs.add(id);
    this._map.addSource(id, source);
  }

  addLayer(layer) {
    this._layerRefs.add(layer.id);
    this._map.addLayer(layer);
  }

  queryRenderedFeatures(pointOrBox, options) {
    return this._map.queryRenderedFeatures(pointOrBox, options)
  }

  filterMap(layerId, filterArray) {
    this._map.setFilter(layerId, filterArray);
  }

  // View methods

  hideLayer(layerId) {
    this._map.setLayoutProperty(layerId, 'visibility', 'none');
  }

  showLayer(layerId) {
    this._map.setLayoutProperty(layerId, 'visibility', 'visible');
  }

  resetMapZoom() {
    this._map.zoomTo(defaultZoom);
  }

  // centroids

  showCentroids(centroidsIds) {
    this.showLayer(centroidsLayerId);
    if (centroidsIds) {
      this.filterMap(centroidsLayerId, ['in', 'geostore'].concat(centroidsIds))
    }
  }

  hideCentroids(centroidsIds) {
    if (centroidsIds) {
      this.showLayer(centroidsLayerId);
      this.filterMap(centroidsLayerId, ['!in', 'geostore'].concat(centroidsIds))
    } else {
      this.hideLayer(centroidsLayerId);
    }
  }


  // Popups
  _setPopupLayer(layerId) {
    this._popupLayerId = layerId;
  }

  queryForPopup(event) {
    if (this._popupLayerId && event.point) {
      const features = this.queryRenderedFeatures(event.point, {
        layers: [this._popupLayerId]
      });

      if (!features.length) return;

      const feat = features[0];
      const popup = new Popup();

      popup.setLngLat(feat.geometry.coordinates)
        .setHTML(`<div class='popup-content'>
           <h4>${feat.properties.label}</h4>
           <button value='${feat.id}'>Zoom to Detail</button>
           </div>`);

      this._addPopup(popup);

    }
  }

  removePopup() {
    this._removePopup();
  }

  _addPopup(popup) {
    popup.addTo(this._map);
    this._popup = popup;
  }

  _removePopup() {
    if (this._popup) {
      this._popup.remove();
      this._popup = null;
    }
  }
}

export {
  defaultZoom
};
