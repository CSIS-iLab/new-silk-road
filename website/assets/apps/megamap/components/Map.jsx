import MapboxGl from 'mapbox-gl/dist/mapbox-gl';
import React, { Component, PropTypes } from 'react';

class Map extends Component {

  constructor() {
    super();
    this.map = null;
  }

  componentDidMount() {
    const { accessToken, mapStyle, initialZoom, center } = this.props;

    MapboxGl.accessToken = accessToken;

    this.map = new MapboxGl.Map({
      container: this.refs.mapContainer,
      style: mapStyle,
      zoom: initialZoom,
      center,
    });

    this.map.on('load', () => {
      if (this.props.onMapLoad) {
        this.props.onMapLoad();
      }
    });

    this.map.on('click', (event) => {
      if (this.props.onClick) {
        this.props.onClick(event);
      }
    });

    this.map.on('mousemove', (event) => {
      if (this.props.onMouseMove) {
        this.props.onMouseMove(event);
      }
    });
  }

  render() {
    const { containerStyle } = this.props;
    return (
      <div className="map" ref="mapContainer" style={containerStyle} />
    );
  }
}

Map.propTypes = {
  accessToken: PropTypes.string.isRequired,
  mapStyle: PropTypes.string.isRequired,
  center: PropTypes.arrayOf(PropTypes.number),
  initialZoom: PropTypes.number,
  containerStyle: PropTypes.object,
  onMapLoad: PropTypes.func,
  onClick: PropTypes.func,
  onMouseMove: PropTypes.func,
};

Map.defaultProps = {
  center: [0, 0],
  initialZoom: 3,
};

export default Map;
