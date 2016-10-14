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
      default: {
        lines: lineStyle,
        points: pointStyle,
        polygons: polygonStyle,
        centroids: {
          type: 'symbol',
          layout: {
            'icon-allow-overlap': true,
            'icon-image': '{icon-image}',
          },
          paint: {
            'icon-opacity': 1
          }
        },
      },
      rail: {
        lines: objectMerge(lineStyle, {
          paint: {
            'line-color': '#c34242',
          }
        }),
        points: objectMerge(pointStyle, {
          layout: {
            'icon-image': 'Rail',
          },
        }),
      },
      road: {
        lines: objectMerge(lineStyle, {
          paint: {
            'line-color': '#f68b3f',
          }
        }),
        points: objectMerge(pointStyle, {
          layout: {
            'icon-image': 'Road',
          },
        }),
      },
      seaport: {
        points: objectMerge(pointStyle, {
          layout: {
            'icon-image': 'Seaport',
          },
        }),
      },
      pipeline: {
        lines: objectMerge(lineStyle, {
          paint: {
            'line-color': '#7e3c22',
          }
        }),
      },
      ict: {
        lines: objectMerge(lineStyle, {
          paint: {
            'line-color': '#65bc46',
          }
        }),
      },
      dryport: {
        points: objectMerge(pointStyle, {
          layout: {
            'icon-image': 'Dryport',
          },
        }),
      },
      multimodal: {
        points: objectMerge(pointStyle, {
          layout: {
            'icon-image': 'Dryport',
          },
        }),
      },
      intermodal: {
        points: objectMerge(pointStyle, {
          layout: {
            'icon-image': 'Dryport',
          },
        }),
      },
    };
  }

  getStyleFor(geometryType, infrastructureType = null) {
    const typeLookup = infrastructureType ? infrastructureType.toLowerCase().replace(' ', '-') : null;
    if (this._styles.hasOwnProperty(typeLookup)) {
      let lookup = this._styles[typeLookup];
      if (lookup.hasOwnProperty(geometryType)) {
        return lookup[geometryType];
      }
    }
    return this._styles['default'][geometryType];
  }
}
