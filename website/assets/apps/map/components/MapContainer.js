import React, { Component, PropTypes } from "react";
import Map from './Map';
import GeoCentroidActions from '../actions/GeoCentroidActions';
import GeoCentroidStore from '../stores/GeoCentroidStore';
import {GeoJSONSource} from "mapbox-gl/js/mapbox-gl";
import SearchStore from '../stores/SearchStore';

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

const centroidsLayerId = 'project-centroids';

export default class MapContainer extends Component {

  componentDidMount() {
    GeoCentroidStore.listen(this.onGeoCentroids);
    SearchStore.listen(this.onSearchResults);
  }

  handleMapLoad = () => {
    GeoCentroidActions.fetch();
  }

  onGeoCentroids = (data) => {
    this.setState({centroids: data.geo || null});
    if (data.geo) {
      const centroidsSource = new GeoJSONSource({ data: data.geo });
      this.refs.map.addSource('project-centroids-src', centroidsSource);
      const centroidsLayer = Object.assign({
        id: centroidsLayerId,
        source: 'project-centroids-src'
      }, centroidsStyle);
      this.refs.map.addLayer(centroidsLayer);
    }
  }

  onSearchResults = (data) => {
    const {results} = data;
    if (results && results.length > 0) {
      const geoIdentifiers = results.filter((element, index) => element.geo && element.geo.id)
                                    .map((element) => element.geo.id);
      if (geoIdentifiers.length > 0) {
        this.refs.map.showLayer(centroidsLayerId);
      }
      this.refs.map.filterLayer(centroidsLayerId, ['in', 'geostore'].concat(geoIdentifiers));
    } else {
      this.refs.map.hideLayer(centroidsLayerId);
    }
  }

  render() {
    const mapProps = this.props;
    return (
      <Map {...mapProps} ref="map" onMapLoad={this.handleMapLoad} />
    )
  }
}
