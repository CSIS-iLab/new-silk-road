import alt from '../alt';
import ActionListeners from 'alt-utils/lib/ActionListeners';
import MapboxGl, {
  Popup,
  GeoJSONSource
} from "mapbox-gl/js/mapbox-gl";
import GeoCentroidActions from '../actions/GeoCentroidActions';
import GeoStoreActions from '../actions/GeoStoreActions';

const centroidsLayerId = 'project-centroids';

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
    type: 'symbol',
    layout: {
      'icon-allow-overlap': true,
      'icon-image': 'dot'
    },
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
const maxFitZoom = 7;
const boundsPadding = 15;

export default class Cartographer {

  constructor(map) {
    this._map = map;
    this._al = new ActionListeners(alt);
    this._manager = new Map();
    this._popup = null;
    this._addListeners();
  }

  _addListeners() {
    this._al.addActionListener(GeoCentroidActions.UPDATE, this._handleCentroidsUpdate.bind(this));
    this._al.addActionListener(GeoStoreActions.SELECT_GEO_STORE_ID, this._handleGeoStoreSelect.bind(this))
    this._al.addActionListener(GeoStoreActions.UPDATE_GEO_STORE, this._handleGeoStoreUpdate.bind(this))
  }

  // Handlers

  _handleCentroidsUpdate(data) {
    const source = new GeoJSONSource({
      data
    });
    const layer = Object.assign({
      source: centroidsLayerId,
      id: centroidsLayerId,
    }, geoStyles.centroids);
    this.setSource(layer.source, source);
    this.addLayer(layer);
    this._manager.set('centroids', {
      identifiers: [centroidsLayerId]
    });
    this._removePopup();
    this._setPopupLayer(layer.id);
  }

  _handleGeoStoreSelect(identifier) {
    if (!this._manager.has(identifier)) {
      GeoStoreActions.getGeoStore.defer(identifier);
    } else {
      const {
        extent
      } = this._manager.get(identifier);
      if (extent) {
        this._zoomToExtent(extent)
      }
    }
  }

  _handleGeoStoreUpdate(geostore) {
    this.removePopup()
    const {
      identifier,
      extent
    } = geostore;
    if (!this._manager.has(identifier)) {
      const geoTypes = ['lines', 'points', 'polygons'];
      let identifiers = [];
      for (let t of geoTypes) {
        const data = geostore[t];
        if (data.features.length) {
          const layerId = `${identifier}-${t}`;
          identifiers.push(layerId);
          const source = new GeoJSONSource({
            data
          })
          const layer = Object.assign({
            source: layerId,
            id: layerId,
          }, geoStyles[t]);
          this.setSource(layer.source, source, false);
          this.addLayer(layer);
        }
      }
      this._manager.set(identifier, {
        identifiers,
        extent
      });
    }
    if (extent) {
      this._zoomToExtent(extent)
    }
    const managedCentroids = [...this._manager.keys()];
    this.hideCentroids(managedCentroids);
  }

  setSource(id, source, replace = true) {
    const src = this._map.getSource(id);
    if (src && replace) {
      this._map.removeSource(id);
    }
    this._map.addSource(id, source);
  }

  addLayer(layer) {
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

  _zoomToExtent(extent) {
    const isPoint = extent[0] === extent[2] && extent[1] === extent[3];
    if (isPoint) {
      const pt = extent.slice(0, 2);
      this._map.flyTo({
        center: pt,
        zoom: maxFitZoom
      });
    } else if (extent.length === 4) {
      const bounds = new MapboxGl.LngLatBounds.convert(extent);
      this._map.fitBounds(bounds, {
        padding: boundsPadding,
        maxZoom: maxFitZoom
      });
    }
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
