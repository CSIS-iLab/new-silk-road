import React, { Component, PropTypes } from "react";
import Map from './Map';
import GeoCentroidActions from '../actions/GeoCentroidActions';
import GeoCentroidStore from '../stores/GeoCentroidStore';
import {GeoJSONSource} from "mapbox-gl/js/mapbox-gl";

const centroidsStyle = {
  type: 'symbol',
  layout: {
    'icon-allow-overlap': true,
    'icon-image': 'dot'
  },
  paint: {
    'icon-opacity': 1
  }
}

export default class MapContainer extends Component {

  state = {
    centroids: null,
    lines: null,
    points: null,
    polygons: null
  }

  componentDidMount() {
    GeoCentroidStore.listen(this.onGeoCentroids);
  }

  handleMapLoad = () => {
    console.log('handleMapLoad');
    GeoCentroidActions.fetch();
  }

  onGeoCentroids = (data) => {
    this.setState({centroids: data.geo || null});
    if (data.geo) {
      const centroidsSource = new GeoJSONSource({
        data: data.geo
      });
      this.refs.map.addSource('project-centroids-src', centroidsSource);
      let centroidsLayer = Object.assign({
        id: 'project-centroids',
        source: 'project-centroids-src'
      }, centroidsStyle);
      console.log(centroidsLayer);
      this.refs.map.addLayer(centroidsLayer);
    }
  }

  render() {
    const mapProps = this.props;
    return (
      <Map {...mapProps} ref="map" onMapLoad={this.handleMapLoad} />
    )
  }
}
