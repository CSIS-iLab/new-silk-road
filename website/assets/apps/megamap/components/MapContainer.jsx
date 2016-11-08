import React, { Component } from 'react';
import Map from './Map';
import GeoCentroidActions from '../actions/GeoCentroidActions';
import SearchStore from '../stores/SearchStore';
import Cartographer, { defaultZoom } from '../helpers/Cartographer';


export default class MapContainer extends Component {

  constructor() {
    super();
    this.mapCtl = null;

    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.onSearchResults = this.onSearchResults.bind(this);
  }

  onSearchResults(data) {
    const { results } = data;
    this.mapCtl.removePopup();
    if (results && results.length > 0) {
      this.mapCtl.resetMapZoom();
      const geoIdentifiers = results.filter(element => element.geo)
                                    .map(element => element.geo);
      if (geoIdentifiers.length > 0) {
        this.mapCtl.setCurrentGeo(geoIdentifiers);
      }
    } else {
      this.mapCtl.setCurrentGeo();
    }
  }

  handleMapClick(event) {
    this.mapCtl.queryForPopup(event);
  }

  handleMapLoad() {
    this.mapCtl = new Cartographer(this.map.glmap);
    SearchStore.listen(this.onSearchResults);
    GeoCentroidActions.fetch();
  }

  render() {
    const mapProps = this.props;
    return (
      <Map
        {...mapProps}
        initialZoom={defaultZoom}
        ref={(map) => { this.map = map; }}
        onMapLoad={this.handleMapLoad}
        onClick={this.handleMapClick}
      />
    );
  }
}
