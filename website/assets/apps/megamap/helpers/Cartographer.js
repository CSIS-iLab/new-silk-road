/* eslint-disable no-console, class-methods-use-this */

import MapboxGl, {
  NavigationControl,
  Popup,
} from 'mapbox-gl/dist/mapbox-gl';
import ActionListeners from 'alt-utils/lib/ActionListeners';
import alt from '../alt';
import GeoCentroidActions from '../actions/GeoCentroidActions';
import GeoStoreActions from '../actions/GeoStoreActions';
import GeoStoreQueue from './GeoStoreQueue';
import GeoManager from './GeoManager';
import GeoStyles from './GeoStyles';
import InfrastructureTypeStore from '../stores/InfrastructureTypeStore';
import {
  defaultZoom,
  minDetailZoom,
  maxFitZoom,
  onMoveDelayTime,
  boundsPadding,
  updateInterval,
  popContentClass,
} from './map-constants';


const identiferSep = ' : ';
const centroidsLayerId = `project${identiferSep}centroids`;

export default class Cartographer {

  constructor(map) {
    this.map = map;
    this.actionListeners = new ActionListeners(alt);
    this.geoManager = new GeoManager();
    this.geostoreQueue = new GeoStoreQueue();
    this.styles = new GeoStyles();
    this.lastUpdate = null;
    this.updateFrameId = null;
    this.updateDelayId = null;
    this.popup = null;
    this.popupLayerIds = [];
    this.addListeners();
    this.configureMap();
    this.layerIds = InfrastructureTypeStore.state.results.map(({ name }) => name);
  }

  setLayerIds(infrastructure_type) {
    const obj = InfrastructureTypeStore.state.results;
    const visibleIds = []
    if (infrastructure_type.length > 0) {
      for (let i in obj) {
        if (!infrastructure_type.includes(obj[i].id)) {
          this.hideLayer(obj[i].name);
        } else {
          this.showLayer(obj[i].name);
          visibleIds.push(obj[i].name);
        }
      }
      this.layerIds = visibleIds;
      this.setPopupLayers(visibleIds);
    }
  }

  resetLayerIds() {
    this.layerIds = InfrastructureTypeStore.state.results.map(({ name }) => name);
    for (let i in this.layerIds) {
        this.showLayer(this.layerIds[i]);
    }
  }

  addListeners() {
    this.actionListeners.addActionListener(
      GeoCentroidActions.UPDATE,
      this.handleCentroidsUpdate.bind(this),
    );
    this.actionListeners.addActionListener(
      GeoCentroidActions.FAIL,
      this.handleCentroidsFail.bind(this),
    );
    this.actionListeners.addActionListener(
      GeoStoreActions.SELECT_GEO_STORE_ID,
      this.handleGeoStoreSelect.bind(this),
    );
    this.actionListeners.addActionListener(
      GeoStoreActions.DID_GET_GEO_STORE,
      this.handleDidGetGeoStore.bind(this),
    );
    this.map.on('mousemove', this.handleMapMove.bind(this));
    this.map.on('movestart', this.handleStartMapMove.bind(this));
    this.map.on('moveend', this.handleEndMapMove.bind(this));
    this.map.on('click', this.handleMapClick.bind(this));
  }

  beginPeriodicUpdates() {
    this.updateFrameId = window.requestAnimationFrame(this.periodicallyUpdate.bind(this));
  }

  periodicallyUpdate(timestamp) {
    if (!this.lastUpdate) this.lastUpdate = timestamp;
    const progress = timestamp - this.lastUpdate;
    if (progress > updateInterval && !this.mapIsMoving) {
      this.updateMapState();
      this.lastUpdate = timestamp;
    }
    this.updateFrameId = window.requestAnimationFrame(this.periodicallyUpdate.bind(this));
  }

  configureMap() {
    this.map.addControl(new NavigationControl(), 'top-right');
    this.map.scrollZoom.disable();
    this.beginPeriodicUpdates();
  }

  // Handlers

  handleCentroidsFail(error) {
    console.log('Error!');
    console.log(error);
  }

  splitLayers(data) {
    const layerArray = []
    for (let layerIndex in this.layerIds) {
      const layer = Object.assign({
        features: [],
        type: "FeatureCollection",
      });

      for (let featureIndex in data.features) {
        if (data.features[featureIndex].properties.infrastructureType === this.layerIds[layerIndex]) {
          layer.features.push(data.features[featureIndex]);
        }
      }
      layerArray.push(layer);
    }
    return layerArray
  }

  handleCentroidsUpdate(allData) {
    this.geoManager.setGeoIdentifiers(allData.features.map(feat => feat.id));
    const layerArray = this.splitLayers(allData);
    for (let i in layerArray) {
      const thisLayerId = layerArray[i].features[i].properties.infrastructureType
      const data = layerArray[i];
      const source = {
        data,
        type: 'geojson',
      };
      const layer = Object.assign({
        source: thisLayerId,
        id: thisLayerId,
      }, this.styles.getStyleFor('centroids'));

      this.setSource(layer.source, source);
      this.addLayer(layer);
    }

    this.removePopup();
    this.setPopupLayers(this.layerIds);
  }

  handleGeoStoreSelect(identifier) {
    this.geoManager.selectedGeoStore = identifier;
    if (!this.geoManager.hasGeo(identifier)) {
      GeoStoreActions.getGeoStore.defer(identifier);
    } else {
      const extent = this.geoManager.selectedGeoExtent;
      if (extent) {
        this.zoomToExtent(extent);
      }
    }
  }

  handleDidGetGeoStore(geostore) {
    this.removePopup();
    const {
      identifier,
      extent,
      projects,
    } = geostore;
    const [{ infrastructure_type }] = projects;
    this.geostoreQueue.resolveGeoStore(identifier);
    if (!this.geoManager.hasGeo(identifier)) {
      const geoTypes = ['lines', 'points', 'polygons'];
      const identifiers = [];
      geoTypes.forEach((t) => {
        const data = geostore[t];
        if (data.features.length) {
          const layerId = `${identifier}${identiferSep}${t}`;
          identifiers.push(layerId);
          const source = {
            data,
            type: 'geojson',
          };
          const layer = Object.assign({
            source: layerId,
            id: layerId,
            metadata: {
              identifier,
              projects,
              infrastructureType: infrastructure_type,
            },
          }, this.styles.getStyleFor(t, infrastructure_type));
          this.setSource(layer.source, source, false);
          this.addLayer(layer);
        }
      });
      this.geoManager.addGeoRecord(identifier, identifiers, extent);
    }
    if (this.geoManager.selectedGeoStore === identifier && extent) {
      this.zoomToExtent(extent);
    }
  }

  handleStartMapMove() {
    if (this.updateFrameId) {
      window.cancelAnimationFrame(this.updateFrameId);
    }
  }

  handleMapMove(event) {
    for (let i in this.LayerIds) {
      if (this.map.getLayer(this.layerIds[i]) !== undefined) {
        const features = this.map.queryRenderedFeatures(event.point, { layers: this.layerIds });
        this.map.getCanvas().style.cursor = features.length ? 'pointer' : '';
      }
    }
  }

  handleEndMapMove() {
    this.beginPeriodicUpdates();
    if (this.updateDelayId) {
      clearTimeout(this.updateDelayId);
      this.updateDelayId = null;
    } else {
      const self = this;
      this.updateDelayId = setTimeout(() => {
        self.updateDelayId = null;
        const zoomLevel = self.map.getZoom();
        if (zoomLevel >= minDetailZoom) {
          const identifiers = self.getCurrentCentroids()
            .map(obj => obj.properties.geostore);
          self.updateGeometries([...new Set(identifiers)]);
        }
      }, onMoveDelayTime);
    }
  }

  handleMapClick(event) {
    const {
      point,
      lngLat,
    } = event;
    const layers = this.geoManager.layerIdentifiers;
    if (layers.length) {
      const width = 20;
      const height = 20;
      const bbox = [
        [point.x - (width / 2), point.y - (height / 2)],
        [point.x + (width / 2), point.y + (height / 2)],
      ];
      const features = this.map.queryRenderedFeatures(bbox, {
        layers,
      });

      if (!features.length) return;

      const feat = features[0];
      const {
        projects,
      } = feat.layer.metadata;


      const popup = new Popup();

      const itemsListHTML = projects.map(project => `<li><h4>${project.name}</h4>
      <p><a class='button' href='${project.page_url}' target='_blank'>Open detail page</a></p></li>`)
        .join('');

      popup.setLngLat(lngLat)
        .setHTML(`<div class='${popContentClass}'>
           <ul class='clean'>${itemsListHTML}</ul>
           </div>`);

      this.addPopup(popup);
    }
  }

  // Manage map

  updateGeometries(identifiers) {
    identifiers.filter(id => !this.geoManager.hasGeo(id))
      .forEach((id) => {
        this.geostoreQueue.loadGeoStore(id);
      });
  }

  updateMapState() {
    if (this.geoManager.selectedGeoIdentifiers) {
      let visibleCentroids = [...this.geoManager.selectedGeoIdentifiers];
      if (this.map.getZoom() >= minDetailZoom) {
        visibleCentroids = visibleCentroids.filter(
          x => !this.geoManager.loadedGeoIdentifiers.has(x),
        );
      }
      this.showCentroids(visibleCentroids);
    }
  }

  setSource(id, source, replace = true) {
    const src = this.map.getSource(id);
    if (src && replace) {
      this.map.removeSource(id);
    }
    this.map.addSource(id, source);
  }

  addLayer(layer) {
    this.map.addLayer(layer);
  }

  filterMap(layerId, filterArray) {
    this.map.setFilter(layerId, filterArray);
  }

  // View methods

  hideLayer(layerId) {
    this.map.setLayoutProperty(layerId, 'visibility', 'none');
  }

  showLayer(layerId) {
    this.map.setLayoutProperty(layerId, 'visibility', 'visible');
  }

  resetMapZoom() {
    this.map.zoomTo(defaultZoom);
  }

  zoomToExtent(extent) {
    const isPoint = extent[0] === extent[2] && extent[1] === extent[3];
    if (isPoint) {
      const pt = extent.slice(0, 2);
      this.map.flyTo({
        center: pt,
        zoom: maxFitZoom,
      });
    } else if (extent.length === 4) {
      const bounds = MapboxGl.LngLatBounds.convert(extent);
      this.map.fitBounds(bounds, {
        padding: boundsPadding,
        maxZoom: maxFitZoom,
      });
    }
  }

  // search results

  setCurrentGeo(identifiers) {
    this.geoManager.selectedGeoIdentifiers = identifiers;
  }

  showCentroids(centroidsIds) {
    for (let i in this.layerIds) {
      this.showLayer(this.layerIds[i]);
      if (centroidsIds) {
        this.filterMap(this.layerIds[i], ['in', 'geostore'].concat(centroidsIds));
      } else {
        this.filterMap(this.layerIds[i], ['!in', 'geostore', false]);
      }
    }
  }

  hideCentroids(centroidsIds) {
    for (let i in this.layerIds) {
      if (centroidsIds && this.geoManager.centroidsLoaded) {
        this.showLayer(this.layerIds[i]);
        this.filterMap(this.layerIds[i], ['!in', 'geostore'].concat(centroidsIds));
      } else {
        this.hideLayer(this.layerIds[i]);
      }
    }
  }

  getCurrentCentroids() {
    return this.map.queryRenderedFeatures({
      layers: this.layerIds,
    });
  }


  // Popups
  setPopupLayers(layerIds) {
    this.popupLayerIds = layerIds;
  }

  queryForPopup(event) {
    if (this.popupLayerIds && event.point) {
      const features = this.map.queryRenderedFeatures(event.point, {
        layers: this.popupLayerIds,
      });

      if (!features.length) return;

      const feat = features[0];
      const popup = new Popup();

      // Create popup HTML, the hard way. (So we can easily add the event listener to that button)
      const popupContainer = document.createElement('div');
      popupContainer.className = popContentClass;
      const header = document.createElement('h4');
      header.appendChild(document.createTextNode(feat.properties.label || ''));
      const button = document.createElement('button');
      button.appendChild(document.createTextNode('Zoom to Detail'));
      button.addEventListener('click', () => GeoStoreActions.selectGeoStoreId(feat.properties.geostore));
      popupContainer.appendChild(header);
      popupContainer.appendChild(button);
      popup.setLngLat(feat.geometry.coordinates)
           .setDOMContent(popupContainer);

      this.addPopup(popup);
    }
  }

  addPopup(popup) {
    popup.addTo(this.map);
    this.popup = popup;
  }

  removePopup() {
    if (this.popup) {
      this.popup.remove();
      this.popup = null;
    }
  }
}

export {
  defaultZoom,
};
