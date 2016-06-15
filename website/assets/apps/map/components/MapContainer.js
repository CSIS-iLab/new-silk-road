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

const geoStyles = {
  centroids: {
    type: 'symbol',
    layout: {
      'icon-allow-overlap': true,
      'icon-image': 'dot'
    },
    paint: {
      'icon-opacity': 1
    }
  },
  lines: {
    type: 'line',
    layout: {
    },
    paint: {
      'line-color': '#be2323',
      'line-width': 3
    }
  },
  points: {
    type: 'circle',
    layout: {
    },
    paint: {
    }
  }
}

const centroidsLayerId = 'project-centroids';

const defaultZoom = 2;
// const center = [];

export default class MapContainer extends Component {

  state = {
    centroids: null,
    popupLayerId: null,
    currentPopUp: null,
    currentGeoStoreId: null
  }

  componentDidMount() {
    GeoCentroidStore.listen(this.onGeoCentroids);
    SearchStore.listen(this.onSearchResults);
    GeoStore.listen(this.onGeoStoreUpdate);
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

  resetZoom = () => {
    this.refs.map.resetZoom();
  }

  onGeoCentroids = (data) => {
    if (data.geo) {
      const config = {
        sourceId: 'project-centroids-src',
        layerId: centroidsLayerId,
        style: geoStyles.centroids,
        type: 'symbol'
      };
      const source = MapActions.createGeoJSONSource({data: data.geo})
      const layer = MapActions.createLayer(config);
      this.refs.map.addSource(layer.source, source);
      this.refs.map.addLayer(layer);
    }
    this.removeCurrentPopup()
    this.setState({ centroids: data.geo || null, popupLayerId: centroidsLayerId });
  }

  onSearchResults = (data) => {
    const {results} = data;
    this.removeCurrentPopup();
    if (results && results.length > 0) {
      this.resetZoom();
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
      const geoTypes = ['lines', 'points'];
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
          this.refs.map._map.fitBounds(bounds, {padding: 15});
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
