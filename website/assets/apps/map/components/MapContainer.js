import React, { Component, PropTypes } from "react";
import Map from './Map';
import MapboxGl from "mapbox-gl/js/mapbox-gl";
import {Popup} from "mapbox-gl/js/mapbox-gl";
import GeoCentroidActions from '../actions/GeoCentroidActions';
import GeoCentroidStore from '../stores/GeoCentroidStore';
import SearchStore from '../stores/SearchStore';
import GeoStoreActions from '../actions/GeoStoreActions';
import GeoStore from '../stores/GeoStore';
import MapActions from '../actions/MapActions';
import Cartographer, {defaultZoom} from '../helpers/Cartographer';


export default class MapContainer extends Component {

  state = {
    currentGeoStoreId: null
  }

  componentDidMount() {
    SearchStore.listen(this.onSearchResults);
    GeoStore.listen(this.onGeoStoreUpdate);

    this.mapCtl = new Cartographer(this.refs.map._map);
  }

  handleMapLoad = () => {
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
      const geoIdentifiers = results.filter((element, index) => element.geo && element.geo.id)
                                    .map((element) => element.geo.id);
      if (geoIdentifiers.length > 0) {
        this.mapCtl.showCentroids(geoIdentifiers);
      }
    } else {
      this.mapCtl.hideCentroids();
    }
  }

  onGeoStoreUpdate = (data) => {
    console.log("onGeoStoreUpdate");
    console.log(data);
    if (data.geoStoreId !== this.state.currentGeoStoreId) {
      console.log("onGeoStoreUpdate -> currentGeoStoreId");
      this.setState({currentGeoStoreId: data.geoStoreId});
      GeoStoreActions.getGeoStore.defer(data.geoStoreId);
    }
    if (data.geoStore) {
      console.log("onGeoStoreUpdate -> Do something with data.geoStore");
      this.removeCurrentPopup()
      const {identifier} = data.geoStore;
      this.refs.map.hideLayer(centroidsLayerId);
      const geoTypes = ['lines', 'points', 'polygons'];
      for (let t of geoTypes) {
        console.log(`geoTypes t = ${t}`);
        let geodata = data.geoStore[t];
        console.log(geodata);
        if (geodata.features.length) {
          let layerId = `${identifier}-${t}`;
          let config = {
            sourceId: `${layerId}-src`,
            layerId: layerId,
            style: geoStyles[t],
            type: t.slice(0, -1)
          };
          let source = MapActions.createGeoJSONSource({data: geodata})
          let layer = MapActions.createLayer(config);
          this.refs.map.addSource(layer.source, source);
          this.refs.map.addLayer(layer);
        }
      }
      if (data.geoStore.extent) {
        const isPoint = (
          data.geoStore.extent[0] === data.geoStore.extent[2] &&
          data.geoStore.extent[1] === data.geoStore.extent[3]
        );
        if (isPoint) {
          console.log('isPoint!');
          const pt = data.geoStore.extent.slice(0,2);
          this.refs.map._map.flyTo({center: pt, zoom: 6});
        } else {
          console.log(`data.geoStore.extent: ${data.geoStore.extent.toString()}`);
          const bounds = new MapboxGl.LngLatBounds.convert(data.geoStore.extent);
          console.log(data.geoStore.extent);
          console.log(bounds);
          this.refs.map._map.fitBounds(bounds, {padding: 15, maxZoom: maxFitZoom});
        }
      }
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
