import MapboxGl from "mapbox-gl/js/mapbox-gl";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

class Map extends Component {
  static propTypes = {
    accessToken: PropTypes.string.isRequired,
    mapStyle: PropTypes.string.isRequired,
    center: PropTypes.arrayOf(PropTypes.number),
    zoom: PropTypes.number,
    containerStyle: PropTypes.object,
  };

  static defaultProps = {
    center: [94.49535790994639, 22.440381130024562],
    zoom: 3
  }

  componentDidMount() {
    const { accessToken, mapStyle, zoom, center } = this.props;

    MapboxGl.accessToken = accessToken;

    const map = new MapboxGl.Map({
      container: this.refs.mapContainer,
      style: mapStyle,
      center,
      zoom
    });
  }

  render() {
    const { containerStyle, map } = this.props;
    return (
      <div className="map" ref="mapContainer" style={containerStyle}>{ map }</div>
    );
  }
}

const token = 'pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw';
const mapStyle = 'mapbox://styles/ilabmedia/cimxgcwgq00njp1nhlyb25pw4';
const containerStyle = {
  width: 'auto',
  height: 600,
}


ReactDOM.render(
  <Map accessToken={token} containerStyle={containerStyle} mapStyle={mapStyle} />,
  document.getElementById('app')
);
