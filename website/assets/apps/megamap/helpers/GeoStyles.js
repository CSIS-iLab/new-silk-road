import {minDetailZoom} from './map-constants';
import objectMerge from 'object-merge';

export default class GeoStyles {
  constructor() {
    let lineStyle = {
      type: 'line',
      minzoom: minDetailZoom,
      layout: {},
      paint: {
        'line-color': '#4d8d8e',
        'line-width': 2
      }
    };
    let pointStyle = {
      type: 'symbol',
      minzoom: minDetailZoom,
      layout: {
        'icon-allow-overlap': true,
        'icon-image': 'dot'
      },
      paint: {}
    };
    let polygonStyle = {
      type: 'fill',
      minzoom: minDetailZoom,
      layout: {},
      paint: {
        'fill-color': '#4d8d8e'
      }
    };
    this._styles = {
      centroids: {
        type: 'symbol',
        layout: {
          'icon-allow-overlap': true,
          'icon-image': '{infrastructureType}',
        },
        paint: {
          'icon-opacity': 1
        }
      },
      lines: lineStyle,
      points: pointStyle,
      polygons: polygonStyle,
      rail: objectMerge(lineStyle, {
        paint: {
          'line-color': '#c34242',
        }
      }),
      road: objectMerge(lineStyle, {
        paint: {
          'line-color': '#f68b3f',
        }
      }),
      seaport: objectMerge(pointStyle, {
        layout: {
          'icon-image': 'Seaport',
        },
      }),
      pipeline: objectMerge(lineStyle, {
        paint: {
          'line-color': '#7e3c22',
        }
      }),
      ict: objectMerge(lineStyle, {
        paint: {
          'line-color': '#65bc46',
        }
      }),
    };

    this._compatibilityTable = {
      'lines': new Set(['rail', 'road', 'pipeline', 'ict']),
      'points': new Set(['seaport',]),
      'polygons': new Set([]),
    }
  }

  getStyleFor(geometryType, infrastructureType = null) {
    const typeLookup = infrastructureType ? infrastructureType.toLowerCase() : null;
    const isGeometryCompatible = typeLookup ? this._compatibilityTable[geometryType].has(typeLookup) : false;
    if (this._styles.hasOwnProperty(typeLookup) && isGeometryCompatible) {
      return this._styles[typeLookup];
    }
    return this._styles[geometryType];
  }
}
