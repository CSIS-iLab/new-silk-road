import alt from '../alt';
import ActionListeners from 'alt-utils/lib/ActionListeners';
import Queue from 'promise-queue';
import MapboxGl, {
  Popup,
  GeoJSONSource
} from "mapbox-gl/js/mapbox-gl";
import GeoCentroidActions from '../actions/GeoCentroidActions';
import GeoStoreActions from '../actions/GeoStoreActions';

const centroidsLayerId = 'project-centroids';
const defaultZoom = 2.0;
const minDetailZoom = 5.0;
const maxFitZoom = 8.0;
const onMoveDelayTime = 750;
const boundsPadding = 15;
const maxConcurrent = 3;
const maxQueue = Infinity;

const geoStyles = {
  centroids: {
    type: 'symbol',
    layout: {
      'icon-allow-overlap': true,
      'icon-image': 'marker_icon'
    },
    paint: {
      'icon-opacity': 1
    }
  },
  lines: {
    type: 'line',
    minzoom: minDetailZoom,
    layout: {},
    paint: {
      'line-color': '#be2323',
      'line-width': 3
    }
  },
  points: {
    type: 'symbol',
    minzoom: minDetailZoom,
    layout: {
      'icon-allow-overlap': true,
      'icon-image': 'dot'
    },
    paint: {}
  },
  polygons: {
    type: 'fill',
    minzoom: minDetailZoom,
    layout: {},
    paint: {
      'fill-color': '#be2323'
    }
  }
}

class GeoManager {
  constructor() {
    this._id_q = new Set();
    this._q = new Queue(maxConcurrent, maxQueue);
    this._selectedGeoIdentifer = null;
    this._geodata = new Map();
    this._centroidsLoaded = false;
  }

  get centroidsLoaded() {
    return this._centroidsLoaded;
  }

  set centroidsLoaded(value) {
    this._centroidsLoaded = value;
  }

  get selectedGeoStore() {
    return this._selectedGeoIdentifer;
  }
  set selectedGeoStore(value) {
    this._selectedGeoIdentifer = value;
  }

  get selectedGeoExtent() {
    const {extent} = this._geodata.get(this._selectedGeoIdentifer);
    return extent;
  }

  addGeoData(identifier, object) {
    this._geodata.set(identifier, object);
  }

  removeGeoData(identifier) {
    this._geodata.delete(identifier);
  }

  hasGeo(identifier) {
    return this._geodata.has(identifier);
  }

  get geoIdentifiers() {
    return [...this._geodata.keys()];
  }

  loadGeoStore(id) {
    // TODO: Make sure geostores aren't requested a bunch
    // TODO: Queue fetching of geostores
    if (!this.hasGeo(id) && !this._id_q.has(id)) {
      this._id_q.add(id);
      this._q.add(() => {
        GeoStoreActions.getGeoStore(id);
      });
    }
  }

  resolveGeoStore(identifier) {
    this._id_q.delete(identifier);
  }

}

export default class Cartographer {

  constructor(map) {
    this._map = map;
    this._al = new ActionListeners(alt);
    this._gm = new GeoManager();
    this._updateDelayId = null;
    this._popup = null;
    this._popupLayerId = null;
    this._addListeners();
  }

  _addListeners() {
    this._al.addActionListener(GeoCentroidActions.UPDATE, this._handleCentroidsUpdate.bind(this));
    this._al.addActionListener(GeoCentroidActions.FAIL, this._handleCentroidsFail.bind(this));
    this._al.addActionListener(GeoStoreActions.SELECT_GEO_STORE_ID, this._handleGeoStoreSelect.bind(this));
    this._al.addActionListener(GeoStoreActions.DID_GET_GEO_STORE, this._handleDidGetGeoStore.bind(this));
    this._map.on('moveend', this._handleEndMapMove.bind(this));
  }

  // Handlers

  _handleCentroidsFail(error) {
    console.log('Error!');
  }

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
    this._gm.centroidsLoaded = true;
    this._removePopup();
    this._setPopupLayer(layer.id);
  }

  _handleGeoStoreSelect(identifier) {
    this._gm.selectedGeoStore = identifier;
    if (!this._gm.hasGeo(identifier)) {
      GeoStoreActions.getGeoStore.defer(identifier);
    } else {
      const extent = this._gm.selectedGeoExtent;
      if (extent) {
        this._zoomToExtent(extent);
      }
    }
  }

  _handleDidGetGeoStore(geostore) {
    this.removePopup()
    const {
      identifier,
      extent
    } = geostore;
    this._gm.resolveGeoStore(identifier);
    if (!this._gm.hasGeo(identifier)) {
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
      this._gm.addGeoData(identifier, {
        identifiers,
        extent
      });
    }
    if (this._gm.selectedGeoStore === identifier && extent) {
      this._zoomToExtent(extent);
    }
    this.hideCentroids(this._gm.geoIdentifiers);
  }

  _handleEndMapMove(event) {
    if (this._updateDelayId) {
      clearTimeout(this._updateDelayId);
    } else {
      this._updateDelayId = setTimeout(() => {
        this._updateDelayId = null;
        const zoomLevel = this._map.getZoom();
        console.log(zoomLevel);
        if (zoomLevel >= minDetailZoom) {
          const identifiers = this._findCentroidsInBounds(this._map.getBounds())
                                  .map((obj) => obj.properties.geostore)
                                  .filter((id) => id);
          this._updateGeometries(identifiers);
        }
      }, onMoveDelayTime);
    }
  }

  _updateGeometries(identifiers) {
    console.log(`identifiers: ${identifiers.length}`);
    identifiers.forEach((id) => {
      this._gm.loadGeoStore(id);
    })
  }


  // Manage map

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
    if (centroidsIds && this._gm.centroidsLoaded) {
      this.showLayer(centroidsLayerId);
      this.filterMap(centroidsLayerId, ['!in', 'geostore'].concat(centroidsIds))
    } else {
      this.hideLayer(centroidsLayerId);
    }
  }

  _findCentroidsInBounds(bounds) {
    return this.queryRenderedFeatures(bounds, {
      layers: [centroidsLayerId]
    });
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
