import React, { Component, PropTypes } from "react";
import Map from './Map';
import MapboxGl from "mapbox-gl/dist/mapbox-gl.js";
import {Popup} from "mapbox-gl/dist/mapbox-gl.js";
import GeoCentroidActions from '../actions/GeoCentroidActions';
import SearchStore from '../stores/SearchStore';
import Cartographer, {defaultZoom} from '../helpers/Cartographer';


export default class MapContainer extends Component {

  handleMapLoad = () => {
    this.mapCtl = new Cartographer(this.refs.map._map);
    SearchStore.listen(this.onSearchResults);
    GeoCentroidActions.fetch();
  }

  handleMapClick = (event) => {
    this.mapCtl.queryForPopup(event);
  }

  onSearchResults = (data) => {
    const {results} = data;
    this.mapCtl.removePopup();
    if (results && results.length > 0) {
      this.mapCtl.resetMapZoom();
      const geoIdentifiers = results.filter((element, index) => element.geo)
                                    .map((element) => element.geo);
      if (geoIdentifiers.length > 0) {
        this.mapCtl.setCurrentGeo(geoIdentifiers);
      }
    } else {
      this.mapCtl.setCurrentGeo();
    }
  }

  render() {
    const mapProps = this.props;
    return (
      <Map {...mapProps}
        initialZoom={defaultZoom}
        ref="map"
        onMapLoad={this.handleMapLoad}
        onClick={this.handleMapClick}
      />
    )
  }
}
