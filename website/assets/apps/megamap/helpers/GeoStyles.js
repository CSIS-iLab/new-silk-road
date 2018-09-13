import objectMerge from 'object-merge';
import { minDetailZoom, maxFitZoom } from './map-constants';

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
            'icon-image': {
              stops: [
                [0, 'Rail'],
                [maxFitZoom, 'RailIcon'],
              ],
            },
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
            'icon-image': {
              stops: [
                [0, 'Road'],
                [maxFitZoom, 'RoadIcon'],
              ],
            },
          },
        }),
      },
      powerplant: {
        points: objectMerge(pointStyle, {
          layout: {
            'icon-image': {
              stops: [
                [0, 'Powerplant'],
                [minDetailZoom, 'PowerplantIcon'],
              ],
            },
          },
        }),
      },
      seaport: {
        points: objectMerge(pointStyle, {
          layout: {
            'icon-image': {
              stops: [
                [0, 'Seaport'],
                [minDetailZoom, 'SeaportIcon'],
              ],
            },
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
            'icon-image': {
              stops: [
                [0, 'Dryport'],
                [minDetailZoom, 'DryportIcon'],
              ],
            },
          },
        }),
      },
      multimodal: {
        points: objectMerge(pointStyle, {
          layout: {
            'icon-image': {
              stops: [
                [0, 'Dryport'],
                [minDetailZoom, 'DryportIcon'],
              ],
            },
          },
        }),
      },
      intermodal: {
        points: objectMerge(pointStyle, {
          layout: {
            'icon-image': {
              stops: [
                [0, 'Dryport'],
                [minDetailZoom, 'DryportIcon'],
              ],
            },
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
