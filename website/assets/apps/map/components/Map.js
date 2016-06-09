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
    console.log(`addLayer: ${layer.toString()}`);
    this.map.addLayer(layer);
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
  }

  render() {
    const { containerStyle } = this.props;
    return (
      <div className="map" ref="mapContainer" style={containerStyle}></div>
    );
  }
}
