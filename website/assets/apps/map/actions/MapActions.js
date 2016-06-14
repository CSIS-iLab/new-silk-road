import {GeoJSONSource} from "mapbox-gl/js/mapbox-gl";

export default class MapActions {
  // Not Alt actions, but plain-old ones
  static createGeoJSONSource = (config) => {
    return new GeoJSONSource(config);
  }

  static createLayer = (config) => {
    const {sourceId, layerId, type, style} = config;
    return Object.assign({id: layerId, type: type, source: sourceId }, style || {});
  }

}
