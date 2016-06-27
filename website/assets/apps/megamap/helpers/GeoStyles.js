import {minDetailZoom} from './map-constants';

export default class GeoStyles {
  constructor() {
    this._styles = {
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
          'line-color': '#f68b3f',
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
      },
      rail: {
        type: 'line',
        minzoom: minDetailZoom,
        layout: {},
        paint: {
          'line-color': '#269d28',
          'line-width': 4
        }
      },
      road: {
        type: 'line',
        minzoom: minDetailZoom,
        layout: {},
        paint: {
          'line-color': '#705a5a',
          'line-width': 2
        }
      },
      seaport: {
        type: 'symbol',
        minzoom: minDetailZoom,
        layout: {
          'icon-allow-overlap': true,
          'icon-image': 'Seaport'
        },
        paint: {}
      }
    };
    this._infraStructureMap = {
      rail: 'lines',
      road: 'lines',
      seaport: 'points'
    };
  }

  getStyleFor(geometryType, infrastructureType = null) {
    const typeLookup = infrastructureType ? infrastructureType.toLowerCase() : infrastructureType;
    if (this._infraStructureMap[typeLookup] === geometryType) {
      return this._styles[typeLookup];
    }
    return this._styles[geometryType];
  }
}
