/* eslint-disable no-console */

import 'babel-polyfill';
import 'whatwg-fetch';
import MapboxGl, {
  Navigation,
} from 'mapbox-gl/dist/mapbox-gl';
import GeoStyles from '../megamap/helpers/GeoStyles';

const ProjectDetail = window.ProjectDetail || {};

class Map {
  constructor(geoURL, mapConfig, infrastructureType = null) {
    this.geoURL = geoURL;
    this.geoLoaded = false;
    this.infrastructureType = infrastructureType;
    const { accessToken, disableHandlers, hideNavigation, ...config } = mapConfig;
    MapboxGl.accessToken = accessToken;
    this.map = new MapboxGl.Map(config);
    disableHandlers.forEach((handler) => {
      this.map[handler].disable();
    });
    if (hideNavigation !== true) {
      this.map.addControl(new Navigation({ position: 'top-left' }));
    }
    this.map.on('load', this.handleMapDidLoad.bind(this));
    this.stylo = new GeoStyles();
  }

  handleMapDidLoad() {
    if (!this.geoLoaded) {
      this.loadGeodata();
    }
  }

  loadGeodata() {
    if (this.geoURL) {
      fetch(this.geoURL, { credentials: 'same-origin' })
      .then(response => response.json())
      .then((json) => {
        this.geoLoaded = true;
        return this.mapProjectLayers(json);
      })
      .catch(error => console.error(error));
    } else {
      console.error('No geoURL to load!');
    }
  }

  mapProjectLayers(json) {
    const {
      extent,
    } = json;
    const camera = {
      bounds: extent,
      maxZoom: 10,
      padding: 40,
    };
    const geoTypes = ['lines', 'points', 'polygons'];
    geoTypes.forEach((t) => {
      const data = json[t];
      if (data.features.length) {
        const layerId = `${t}-layer`;
        this.map.addSource(layerId, {
          data,
          type: 'geojson',
        });
        const layer = Object.assign({
          source: layerId,
          id: layerId,
        }, this.stylo.getStyleFor(t, this.infrastructureType));
        delete layer.minzoom; // Some big shapes won't show otherwise
        this.map.addLayer(layer);
      }
    });
    this.map.fitBounds(camera.bounds, camera);
  }
}

ProjectDetail.Map = Map;
window.ProjectDetail = ProjectDetail;
