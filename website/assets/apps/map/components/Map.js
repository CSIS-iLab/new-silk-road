import MapboxGl from "mapbox-gl/js/mapbox-gl";
import React, { Component, PropTypes } from "react";

export default class Map extends Component {
  static propTypes = {
    accessToken: PropTypes.string.isRequired,
    mapStyle: PropTypes.string.isRequired,
    center: PropTypes.arrayOf(PropTypes.number),
    zoom: PropTypes.number,
    containerStyle: PropTypes.object,
    onMapLoad: PropTypes.func,
    onClick: PropTypes.func,
    onMouseMove: PropTypes.func,
  };

  static defaultProps = {
    center: [94.49535790994639, 22.440381130024562],
    zoom: 3
  }

  _map = null;

  addSource = (id, src) => {
    this._map.addSource(id, src);
  }

  addLayer = (layer) => {
    this._map.addLayer(layer);
  }

  filterLayer = (layerId, filter) => {
    this._map.setFilter(layerId, filter);
  }

  hideLayer = (layerId) => {
    this._map.setLayoutProperty(layerId, 'visibility', 'none');
  }

  showLayer = (layerId) => {
    this._map.setLayoutProperty(layerId, 'visibility', 'visible');
  }

  onZoomEnd = (event) => {
    // console.log('zoomed!');
  }

  componentDidMount() {
    const { accessToken, mapStyle, zoom, center } = this.props;

    MapboxGl.accessToken = accessToken;

    this._map = new MapboxGl.Map({
      container: this.refs.mapContainer,
      style: mapStyle,
      center,
      zoom
    });

    this._map.on('load', () => {
      if (this.props.onMapLoad) {
        this.props.onMapLoad();
      }
    });

    this._map.on('click', (event) => {
      if(this.props.onClick) {
        this.props.onClick(event);
      }
    });

    this._map.on('mousemove', (event) => {
      if (this.props.onMouseMove) {
        this.props.onMouseMove(event);
      }
    });

    this._map.on('zoomend', (event) => {
      this.onZoomEnd(event);
    });

  }

  componentDidUpdate() {
    const mapZoom = this._map.getZoom();
    if (this.props.zoom != mapZoom) {
      this._map.zoomTo(this.props.zoom);
    }
  }

  render() {
    const { containerStyle } = this.props;
    return (
      <div className="map" ref="mapContainer" style={containerStyle}></div>
    );
  }
}
