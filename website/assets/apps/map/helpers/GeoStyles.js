import {minDetailZoom} from './map-constants';

const GeoStyles = {
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
      'line-color': '#be2323',
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
  }
}

export default GeoStyles;
