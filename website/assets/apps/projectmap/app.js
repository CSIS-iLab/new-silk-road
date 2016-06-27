import "babel-polyfill";
import 'whatwg-fetch';
import MapboxGl, {
  GeoJSONSource
} from "mapbox-gl/js/mapbox-gl";
import GeoStyles from '../megamap/helpers/GeoStyles';

var ProjectDetail = window.ProjectDetail || {};

class Map {
  constructor(geoURL, mapConfig) {
    this._geoURL = geoURL;
    this._geoLoaded = false;
    const {accessToken, ...config} = mapConfig;
    MapboxGl.accessToken = accessToken;
    this._map = new MapboxGl.Map(config);
    this._map.on('load', this._handleMapDidLoad.bind(this));
    this._stylo = new GeoStyles();
  }

  _handleMapDidLoad = (event) => {
    if (!this._geoLoaded) {
      this._loadGeodata();
    }
  }

  _loadGeodata() {
    if (this._geoURL) {
      fetch(this._geoURL)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this._geoLoaded = true;
        return this._mapProjectLayers(json)
      })
      .catch((error) => console.error(error));
    } else {
      console.error("No geoURL to load!");
    }
  }

  _mapProjectLayers(json) {
    const {
      extent,
    } = json;
    const camera = {
        bounds: extent,
        maxZoom: 15,
        padding: 40
    };
    const geoTypes = ['lines'];
    for (let t of geoTypes) {
      const data = json[t];
      if (data.features.length) {
        const layerId = `${t}-layer`;
        const source = new GeoJSONSource({
          data
        })
        this._map.addSource(layerId, source);
        const layer = Object.assign({
          source: layerId,
          id: layerId,
        }, this._stylo.getStyleFor('lines'));
        this._map.addLayer(layer);
      }
    }
    this._map.fitBounds(camera.bounds, camera);

  }
}

ProjectDetail.Map = Map;
window.ProjectDetail = ProjectDetail;
