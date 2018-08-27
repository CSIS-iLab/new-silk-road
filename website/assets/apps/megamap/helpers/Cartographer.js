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
    this.popupLayerId = null;
    this.addListeners();
    this.configureMap();
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
    this.map.addControl(new NavigationControl(), 'top-left');
    this.map.scrollZoom.disable();
    this.beginPeriodicUpdates();
  }

  // Handlers

  handleCentroidsFail(error) {
    console.log('Error!');
    console.log(error);
  }

  handleCentroidsUpdate(data) {
    this.geoManager.setGeoIdentifiers(data.features.map(feat => feat.id));
    const source = {
      data,
      type: 'geojson',
    };
    const layer = Object.assign({
      source: centroidsLayerId,
      id: centroidsLayerId,
    }, this.styles.getStyleFor('centroids'));
    this.setSource(layer.source, source);
    this.addLayer(layer);
    this.removePopup();
    this.setPopupLayer(layer.id);
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
    const {
      identifier,
      extent,
      projects,
    } = geostore;

    // If the geostore's identifier has a button in the DOM, then add set the href
    // attribute of that button to the first project's detail page URL. Otherwise,
    // handle showing the geoTypes on the map.
    var identifierButton = document.getElementById('button_' + geostore.identifier);
    if (identifierButton !== null) {
      identifierButton.setAttribute('href', projects[0].page_url);
    } else {
      this.removePopup();
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
  }

  handleStartMapMove() {
    if (this.updateFrameId) {
      window.cancelAnimationFrame(this.updateFrameId);
    }
  }

  handleMapMove(event) {
    if (this.map.getLayer(centroidsLayerId) !== undefined) {
      const features = this.map.queryRenderedFeatures(event.point, { layers: [centroidsLayerId] });
      this.map.getCanvas().style.cursor = features.length ? 'pointer' : '';
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

      // Get the HTML of the popup
      const popupHTML = projects.map(project => {
        // Get the total cost, round it to have 1 decimal point, and add a word
        // for the total cost unit, like "million" or "billion".
        var totalCost;
        if (project.total_cost === null) {
          totalCost = "Unknown"
        } else {
          if (project.total_cost > 10**12) {
            var totalCostDividend = (project.total_cost / 10**12).toFixed(1);
            var totalCostUnit = " trillion ";
          } else if (project.total_cost > 10**9) {
            var totalCostDividend = (project.total_cost / 10**9).toFixed(1);
            var totalCostUnit = " billion ";
          } else if (project.total_cost > 10**6) {
            var totalCostDividend = (project.total_cost / 10**6).toFixed(1);
            var totalCostUnit = " million ";
          } else if (project.total_cost > 10**3) {
            var totalCostDividend = (project.total_cost / 10**3).toFixed(1);
            var totalCostUnit = " thousand";
          } else {
            var totalCostDividend = project.total_cost.toFixed(1);
            var totalCostUnit = " ";
          }
          totalCost = totalCostDividend + totalCostUnit
          if (project.total_cost_currency !== null) {
            totalCost += project.total_cost_currency;
          }
        }
        // Return the HTML of the popup
        return `<div>
            <h4>${project.name}</h4>
            <div>LOCATIONS</div>
            <div>${project.locations}</div>
            <div>TYPE</div>
            <div>${project.infrastructure_type}</div>
            <div>TOTAL REPORTED COST</div>
            <div>${totalCost}</div>
            <p>
              <a class='button' href='${project.page_url}' target='_blank'>VIEW PROJECT PAGE</a>
            </p>
          </div>`
      })
      .join('');

      popup.setLngLat(lngLat)
        .setHTML(`<div class='${popContentClass}'>
           <div class='clean'>${popupHTML}</div>
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
    this.showLayer(centroidsLayerId);
    if (centroidsIds) {
      this.filterMap(centroidsLayerId, ['in', 'geostore'].concat(centroidsIds));
    } else {
      this.filterMap(centroidsLayerId, ['!in', 'geostore', false]);
    }
  }

  hideCentroids(centroidsIds) {
    if (centroidsIds && this.geoManager.centroidsLoaded) {
      this.showLayer(centroidsLayerId);
      this.filterMap(centroidsLayerId, ['!in', 'geostore'].concat(centroidsIds));
    } else {
      this.hideLayer(centroidsLayerId);
    }
  }

  getCurrentCentroids() {
    return this.map.queryRenderedFeatures({
      layers: [centroidsLayerId],
    });
  }


  // Popups
  setPopupLayer(layerId) {
    this.popupLayerId = layerId;
  }

  queryForPopup(event) {
    if (this.popupLayerId && event.point) {
      const features = this.map.queryRenderedFeatures(event.point, {
        layers: [this.popupLayerId],
      });

      if (!features.length) return;

      const feat = features[0];
      const popup = new Popup();

      // Create popup HTML, the hard way. (So we can easily add the event listener to that button)
      const popupContainer = document.createElement('div');
      popupContainer.className = popContentClass;
      const header = document.createElement('h4');
      header.appendChild(document.createTextNode(feat.properties.label || ''));
      const locationsLabelDiv = document.createElement('div');
      locationsLabelDiv.appendChild(document.createTextNode('Locations'.toUpperCase()));
      const locationsDataDiv = document.createElement('div');
      locationsDataDiv.appendChild(document.createTextNode(feat.properties.locations));
      const typeLabelDiv = document.createElement('div');
      typeLabelDiv.appendChild(document.createTextNode('Type'.toUpperCase()));
      const typeDataDiv = document.createElement('div');
      typeDataDiv.appendChild(document.createTextNode(feat.properties.infrastructureType));
      const totalCostLabelDiv = document.createElement('div');
      totalCostLabelDiv.appendChild(document.createTextNode('Total Reported Cost'.toUpperCase()));
      const totalCostDataDiv = document.createElement('div');
      totalCostDataDiv.appendChild(document.createTextNode(feat.properties.total_cost));
      const button = document.createElement('a');
      button.setAttribute('id', 'button_' + feat.properties.geostore);
      button.setAttribute('class', 'button');
      button.setAttribute('target', '_blank');
      button.appendChild(document.createTextNode('View Project Page'.toUpperCase()));

      popupContainer.appendChild(header);
      popupContainer.appendChild(locationsLabelDiv);
      popupContainer.appendChild(locationsDataDiv);
      popupContainer.appendChild(typeLabelDiv);
      popupContainer.appendChild(typeDataDiv);
      popupContainer.appendChild(totalCostLabelDiv);
      popupContainer.appendChild(totalCostDataDiv);
      popupContainer.appendChild(button);
      popup.setLngLat(feat.geometry.coordinates)
           .setDOMContent(popupContainer);

      this.addPopup(popup);

      // Now that the popup has been added, get the geostore data for this point.
      // Note: when the data returns from the backend, .handleDidGetGeoStore()
      // will set the button's href to this point's project's detail page URL.
      GeoStoreActions.getGeoStore(feat.properties.geostore);
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
