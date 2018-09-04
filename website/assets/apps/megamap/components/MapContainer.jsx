import React, { Component } from 'react';
import Map from './Map';
import GeoCentroidActions from '../actions/GeoCentroidActions';
import SearchStore from '../stores/SearchStore';
import Cartographer, { defaultZoom } from '../helpers/Cartographer';
import InfrastructureTypeStore from '../stores/InfrastructureTypeStore';

export default class MapContainer extends Component {

  constructor() {
    super();
    this.mapCtl = null;
    this.state = { loading: '' }
    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.onSearchResults = this.onSearchResults.bind(this);
    this.handleLoading = this.handleLoading.bind(this);
  }

  onSearchResults(data) {
    const { total, results, isSearching, query } = data;

    this.handleLoading(isSearching);
    this.mapCtl.removePopup();
    this.mapCtl.resetMapZoom();

    if (!isSearching && results) {
      // check query to see if we are searching for more than just infrstructure_type,
      // then simply hide and show layers depending on query.
      const queryKeys = Object.keys(query);
      const geoIdentifiers = results.filter(element => element.geo)
                                      .map(element => element.geo);
      // if we are only searching on infastructure_type, then we only show or hide layers
      if (queryKeys.length === 1 && query.infrastructure_type.length > 0) {
        this.mapCtl.setLayerIds(query.infrastructure_type);
        this.mapCtl.setCurrentGeo();
      } else {
        if (geoIdentifiers.length > 0) {
          this.mapCtl.setCurrentGeo(geoIdentifiers);
        }
        this.mapCtl.setLayerIds(query.infrastructure_type);
      }
    }
  }

  handleLoading(isSearching){
    let searching = isSearching ? 'loading' : '';
    this.setState({ loading: searching });
  }

  handleMapClick(event) {
    this.mapCtl.queryForPopup(event);
  }

  handleMapLoad() {
    this.mapCtl = new Cartographer(this.map.glmap);
    SearchStore.listen(this.onSearchResults);
    GeoCentroidActions.fetch();
    window.Cart = this.mapCtl;
  }

  render() {
    const mapProps = this.props;
    return (
      <div id="megaMapContainer" className={this.state.loading}>
        <Map
          {...mapProps}
          initialZoom={defaultZoom}
          ref={(map) => { this.map = map; }}
          onMapLoad={this.handleMapLoad}
          onClick={this.handleMapClick}
        />
        <div className="mapLoading">
          <div className="loader"></div>
        </div>
      </div>
    );
  }
}
