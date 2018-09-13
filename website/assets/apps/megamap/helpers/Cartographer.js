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

  geoStoreShouldBeZoomedMore(sourceLayer) {
    /* Determine if zooming should be enabled for this geo coordinate at this zoom level:
     *  - Points may be zoomed to further if the current zoom is less than maxFitZoom
     *  - Lines may be zoomed to further if the current zoom is less than minDetailZoom
     *  - Centroids may be zoomed to further if the current zoom is less than minDetailZoom
     *  - Rails may be zoomed to further if the current zoom is less than minDetailZoom
     *  - Roads may be zoomed to further if the current zoom is less than minDetailZoom
     *  - Intermodals may be zoomed to further if the current zoom is less than maxFitZoom
     *  - Power Plants may be zoomed to further if the current zoom is less than maxFitZoom
     *  - Seaports may be zoomed to further if the current zoom is less than maxFitZoom
     *  - Other cases may not be zoomed further
     */

    // The lowercase version of the source layer name
    const lowerSourceLayer = sourceLayer.toLowerCase();

    // Layers that can be zoomed until minDetailZoom
    const useMinDetailZoom = ['rail', 'road'];
    // Layers that can be zoomed until maxFitZoom
    const usemaxFitZoom = ['intermodal', 'powerplant', 'seaport'];

    if (useMinDetailZoom.indexOf(lowerSourceLayer) !== -1 && this.map.getZoom() < minDetailZoom) {
      return true;
    } else if (usemaxFitZoom.indexOf(lowerSourceLayer) !== -1 && this.map.getZoom() < maxFitZoom) {
      return true;
    } else if (lowerSourceLayer.indexOf('lines') !== -1 && this.map.getZoom() < minDetailZoom) {
      // Line layers look like 'abcd1234-1234-123a-1abc-a1234bc45d6e : lines'
      return true;
    } else if (lowerSourceLayer.indexOf('centroids') !== -1 && this.map.getZoom() < minDetailZoom) {
      // Centroid layers look like 'abcd1234-1234-123a-1abc-a1234bc45d6e : centroid'
      return true;
    } else if (lowerSourceLayer.indexOf('points') !== -1 && this.map.getZoom() < maxFitZoom) {
      // Point layers look like 'abcd1234-1234-123a-1abc-a1234bc45d6e : point'
      return true;
    } else {
      return false;
    }
  }


  // Handlers

  handleCentroidsFail(error) {
    console.log('Error!');
    console.log(error);
    this.map._container.parentElement.lastChild.innerHTML = '<div class="loadError">We encountered an error. Please reload the page.</div>';
  }

  removeLoading() {
    // a little basic javascript to avoid react gymnastics
    this.map._container.parentElement.classList.remove('loading');
  }

  splitLayers(data) {
    const layerArray = []
    for (let layerIndex in this.layerIds) {
      const layer = Object.assign({
        features: [],
        type: "FeatureCollection",
      });

      for (let featureIndex in data.features) {
        if (data.features[featureIndex].properties !== undefined && data.features[featureIndex].properties.infrastructureType === this.layerIds[layerIndex]) {
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
      if (layerArray[i].features.length == 0) { continue; }
      const thisLayerId = layerArray[i].features[i].properties.infrastructureType;
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
    this.removeLoading();
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

    // If the geostore's identifier has a button in the DOM without an href, then
    // set the href attribute of that button to the first project's detail page
    // URL. Otherwise, handle showing the geoTypes on the map.
    const identifierButton = document.getElementById(`button_${geostore.identifier}`);
    if (identifierButton !== null && identifierButton.hasAttribute('href') && identifierButton.getAttribute('href') === '') {
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

  getPopupWithContainer(name, locations, infrastructureType, totalCost, buttonId,
    detailPageURL, zoomEnabled, geoIdentifier,
  ) {
    /* Return a popupContainer element with the DOM elements for a (project) popup on the map. */
    const projectName = name || '';
    const projectLocations = locations || 'Not Specified';

    // The popup container
    const popupContainer = document.createElement('div');
    popupContainer.className = popContentClass;

    // Header row
    const header = document.createElement('div');
    header.setAttribute('class', 'popup-header');
    const headerZoomButton = document.createElement('button');
    const headerZoomButtonIcon = document.createElement('span');
    headerZoomButtonIcon.setAttribute('class', 'zoom-magnifying-glass popup-header-zoomicon');
    headerZoomButton.appendChild(headerZoomButtonIcon);
    const headerText = document.createElement('span');
    headerText.appendChild(document.createTextNode('zoom'.toUpperCase()));
    // If the header's zoom button should be enabled, then give it the appropriate
    // CSS class, and add an event listener for when the zoom button is clicked.
    // Clicking the header's zoom button should get the geostore data, which in turn
    // will zoom in to the icon at the appropriate zoom (in this.handleGeoStoreSelect()).
    if (zoomEnabled) {
      headerZoomButton.setAttribute('class', 'popup-header-button');
      headerZoomButton.addEventListener('click', () => GeoStoreActions.selectGeoStoreId(geoIdentifier));
      headerZoomButton.addEventListener('click', () => { this.removePopup(); });
      headerText.setAttribute('class', 'popup-header-text');
    } else {
      headerZoomButton.setAttribute('class', 'popup-header-button-disabled');
      headerText.setAttribute('class', 'popup-header-text-disabled');
    }
    header.appendChild(headerZoomButton);
    header.appendChild(headerText);

    // Project name element
    const nameElement = document.createElement('h3');
    nameElement.appendChild(document.createTextNode(projectName));

    // Project locations row
    const locationsRow = document.createElement('div');
    locationsRow.setAttribute('class', 'popup-row');
    const locationsLabelDiv = document.createElement('div');
    locationsLabelDiv.appendChild(document.createTextNode('Locations'.toUpperCase()));
    const locationsDataDiv = document.createElement('div');
    locationsDataDiv.setAttribute('class', 'popup-row-data');
    locationsDataDiv.appendChild(document.createTextNode(projectLocations));
    locationsRow.appendChild(locationsLabelDiv);
    locationsRow.appendChild(locationsDataDiv);

    // Project type row
    const typeRow = document.createElement('div');
    typeRow.setAttribute('class', 'popup-row');
    const typeLabelDiv = document.createElement('div');
    typeLabelDiv.appendChild(document.createTextNode('Type'.toUpperCase()));
    const typeDataDiv = document.createElement('div');
    typeDataDiv.setAttribute('class', 'popup-row-data');
    typeDataDiv.appendChild(document.createTextNode(infrastructureType));
    typeRow.appendChild(typeLabelDiv);
    typeRow.appendChild(typeDataDiv);

    // Total cost row
    const totalCostRow = document.createElement('div');
    totalCostRow.setAttribute('class', 'popup-row');
    const totalCostLabelDiv = document.createElement('div');
    totalCostLabelDiv.appendChild(document.createTextNode('Total Reported Cost'.toUpperCase()));
    const totalCostDataDiv = document.createElement('div');
    totalCostDataDiv.setAttribute('class', 'popup-row-data');
    totalCostDataDiv.appendChild(document.createTextNode(totalCost));
    totalCostRow.appendChild(totalCostLabelDiv);
    totalCostRow.appendChild(totalCostDataDiv);

    // Button row
    const buttonHolderRow = document.createElement('div');
    buttonHolderRow.setAttribute('class', 'popup-row popup-buttonholder');
    const button = document.createElement('a');
    button.setAttribute('id', buttonId);
    button.setAttribute('href', detailPageURL);
    button.setAttribute('target', '_blank');
    button.setAttribute('class', 'button popup-button');
    button.appendChild(document.createTextNode('View Project Page'.toUpperCase()));
    buttonHolderRow.appendChild(button);

    // Append each of the rows of the popup to the popupContainer
    popupContainer.appendChild(header);
    popupContainer.appendChild(nameElement);
    popupContainer.appendChild(locationsRow);
    popupContainer.appendChild(typeRow);
    popupContainer.appendChild(totalCostRow);
    popupContainer.appendChild(buttonHolderRow);

    return popupContainer;
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

      // Determine if zooming should be enabled for the popup
      const zoomEnabled = this.geoStoreShouldBeZoomedMore(feat.layer.source);

      // Create the popup
      const popup = new Popup();

      // Get the DOM elements of the popup
      const popupContainers = projects.map((project) => {
        // Get the rounded total cost
        const totalCost = this.getRoundedTotalCost(project.total_cost, project.total_cost_currency)

        const buttonId = `button_${project.identifier}`;
        const geoIdentifier = feat.layer.metadata.identifier;

        // Return the DOM element for the popup
        return this.getPopupWithContainer(project.name, project.locations,
          project.infrastructure_type, totalCost, buttonId, project.page_url,
          zoomEnabled, geoIdentifier,
        );
      });

      const parentPopupContainer = document.createElement('div');
      popupContainers.forEach((popupContainer) => {
        parentPopupContainer.appendChild(popupContainer);
      });

      popup.setLngLat(lngLat)
           .setDOMContent(parentPopupContainer);

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

  getRoundedTotalCost(totalCostInteger, currency) {
    /* Given a totalCostInteger and a currency, return a rounded cost with 1 decimal point,
     * a word for the total cost unit (like "million" or "billion"), and the currency.
     * The result should look something like "1.2 million USD".
     */
    let totalCostString;
    if (totalCostInteger === null || totalCostInteger === "null") {
      totalCostString = 'Unknown';
    } else {
      let totalCostDividend;
      let totalCostUnit;
      if (totalCostInteger > 10 ** 15) {
        totalCostDividend = (totalCostInteger / (10 ** 15)).toFixed(1);
        totalCostUnit = ' quadrillion ';
      } else if (totalCostInteger > 10 ** 12) {
        totalCostDividend = (totalCostInteger / (10 ** 12)).toFixed(1);
        totalCostUnit = ' trillion ';
      } else if (totalCostInteger > 10 ** 9) {
        totalCostDividend = (totalCostInteger / (10 ** 9)).toFixed(1);
        totalCostUnit = ' billion ';
      } else if (totalCostInteger > 10 ** 6) {
        totalCostDividend = (totalCostInteger / (10 ** 6)).toFixed(1);
        totalCostUnit = ' million ';
      } else if (totalCostInteger > 10 ** 3) {
        totalCostDividend = (totalCostInteger / (10 ** 3)).toFixed(1);
        totalCostUnit = ' thousand';
      } else {
        totalCostDividend = totalCostInteger.toFixed(1);
        totalCostUnit = ' ';
      }
      totalCostString = totalCostDividend + totalCostUnit;
      if (currency !== null) {
        totalCostString += currency;
      }
    }
    return totalCostString;
  }

  queryForPopup(event) {
    if (this.popupLayerIds && event.point) {
      const features = this.map.queryRenderedFeatures(event.point, {
        layers: this.popupLayerIds,
      });

      if (!features.length) return;

      const feat = features[0];
      const popup = new Popup();

      const buttonId = `button_${feat.properties.geostore}`;
      const geoIdentifier = feat.properties.geostore;
      // Determine if zooming should be enabled for the popup
      const zoomEnabled = this.geoStoreShouldBeZoomedMore(feat.layer.source);

      // Get the rounded total cost
      const totalCost = this.getRoundedTotalCost(feat.properties.total_cost, feat.properties.currency);

      // Get the DOM elements for the (project) popup
      const popupContainer = this.getPopupWithContainer(feat.properties.label,
        feat.properties.locations, feat.properties.infrastructureType, totalCost,
        buttonId, '', zoomEnabled, geoIdentifier
      );
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
