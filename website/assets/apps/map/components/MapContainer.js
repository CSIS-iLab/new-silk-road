import React, { Component, PropTypes } from "react";
import Map from './Map';
import {Popup} from "mapbox-gl/js/mapbox-gl";
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

const defaultZoom = 2;
// const center = [];

export default class MapContainer extends Component {

  state = {
    zoom: defaultZoom,
    centroids: null,
    popupLayerId: null,
    currentPopUp: null
  }

  componentDidMount() {
    GeoCentroidStore.listen(this.onGeoCentroids);
    SearchStore.listen(this.onSearchResults);
  }

  handleMapLoad = () => {
    GeoCentroidActions.fetch();
  }

  handleMapClick = (event) => {
    if (this.state.popupLayerId && event.point) {
      const features = this.queryRenderedFeatures(event.point, {layers: [this.state.popupLayerId]});

      if(!features.length) return;

      const feat = features[0];
      const popup = new Popup();

      popup.setLngLat(feat.geometry.coordinates)
           .setHTML(`<div class='popup-content'>
           <h4>${feat.properties.label}</h4>
           <button value='${feat.id}'>Zoom to Detail</button>
           </div>`)
           .addTo(this.refs.map._map);

      this.setState({currentPopUp: popup});
    }
  }

  queryRenderedFeatures = (pointOrBox, options) => {
    return this.refs.map._map.queryRenderedFeatures(pointOrBox, options)
  }

  removeCurrentPopup = () => {
    if (this.state.currentPopUp) {
      this.state.currentPopUp.remove();
      this.setState({currentPopUp: null});
    }
  }

  onGeoCentroids = (data) => {
    if (data.geo) {
      const centroidsSource = new GeoJSONSource({ data: data.geo });
      this.refs.map.addSource('project-centroids-src', centroidsSource);
      const centroidsLayer = Object.assign({
        id: centroidsLayerId,
        source: 'project-centroids-src'
      }, centroidsStyle);
      this.refs.map.addLayer(centroidsLayer);
    }
    this.removeCurrentPopup()
    this.setState({ centroids: data.geo || null, popupLayerId: centroidsLayerId });
  }

  onSearchResults = (data) => {
    const {results} = data;
    this.removeCurrentPopup()
    if (results && results.length > 0) {
      this.setState({zoom: defaultZoom});
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
    const {zoom} = this.state;
    return (
      <Map {...mapProps}
        zoom={zoom}
        ref="map"
        onMapLoad={this.handleMapLoad}
        onClick={this.handleMapClick}
      />
    )
  }
}
