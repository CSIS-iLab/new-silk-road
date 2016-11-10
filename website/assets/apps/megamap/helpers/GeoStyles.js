import objectMerge from 'object-merge';
import { minDetailZoom } from './map-constants';

export default class GeoStyles {
  constructor() {
    const lineStyle = {
      type: 'line',
      minzoom: minDetailZoom,
      layout: {},
      paint: {
        'line-color': '#4d8d8e',
        'line-width': 2,
      },
    };
    const pointStyle = {
      type: 'symbol',
      minzoom: minDetailZoom,
      layout: {
        'icon-allow-overlap': true,
        'icon-image': 'dot',
      },
      paint: {},
    };
    const polygonStyle = {
      type: 'fill',
      minzoom: minDetailZoom,
      layout: {},
      paint: {
        'fill-color': '#4d8d8e',
      },
    };
    this.styles = {
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
            'icon-opacity': 1,
          },
        },
      },
      rail: {
        lines: objectMerge(lineStyle, {
          paint: {
            'line-color': '#c34242',
          },
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
          },
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
          },
        }),
      },
      ict: {
        lines: objectMerge(lineStyle, {
          paint: {
            'line-color': '#65bc46',
          },
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
    if ({}.hasOwnProperty.call(this.styles, typeLookup)) {
      const lookup = this.styles[typeLookup];
      if ({}.hasOwnProperty.call(lookup, geometryType)) {
        return lookup[geometryType];
      }
    }
    return this.styles.default[geometryType];
  }
}
