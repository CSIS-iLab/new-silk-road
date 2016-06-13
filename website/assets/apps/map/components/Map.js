import MapboxGl from "mapbox-gl/js/mapbox-gl";
import React, { Component, PropTypes } from "react";

export default class Map extends Component {
  static propTypes = {
    accessToken: PropTypes.string.isRequired,
    mapStyle: PropTypes.string.isRequired,
    center: PropTypes.arrayOf(PropTypes.number),
    zoom: PropTypes.number,
    containerStyle: PropTypes.object,
    onMapLoad: PropTypes.func
  };

  static defaultProps = {
    center: [94.49535790994639, 22.440381130024562],
    zoom: 3
  }

  addSource = (id, src) => {
    this.map.addSource(id, src);
  }

  addLayer = (layer) => {
    this.map.addLayer(layer);
  }

  filterLayer = (layerId, filter) => {
    this.map.setFilter(layerId, filter);
  }

  hideLayer = (layerId) => {
    this.map.setLayoutProperty(layerId, 'visibility', 'none');
  }

  showLayer = (layerId) => {
    this.map.setLayoutProperty(layerId, 'visibility', 'visible');
  }

  onZoomEnd = (event) => {
    // console.log('zoomed!');
  }

  componentDidMount() {
    const { accessToken, mapStyle, zoom, center } = this.props;

    MapboxGl.accessToken = accessToken;

    this.map = new MapboxGl.Map({
      container: this.refs.mapContainer,
      style: mapStyle,
      center,
      zoom
    });

    this.map.on('load', () => {
      this.props.onMapLoad();
    });

    this.map.on('zoomend', (event) => {
      this.onZoomEnd(event);
    })
  }

  componentDidUpdate() {
    const mapZoom = this.map.getZoom();
    if (this.props.zoom != mapZoom) {
      this.map.zoomTo(this.props.zoom);
    }
  }

  render() {
    const { containerStyle } = this.props;
    return (
      <div className="map" ref="mapContainer" style={containerStyle}></div>
    );
  }
}
