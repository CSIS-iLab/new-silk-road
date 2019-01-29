import 'babel-polyfill';
import ReactDOM from 'react-dom';
import React from 'react';
import { StyleRoot } from 'radium';
import MapContainer from './components/MapContainer';
import MobilePlaceholder from './components/MobilePlaceholder';
import SearchView from './components/SearchView';
import { defaultCenter } from './helpers/map-constants';

const token = 'pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw';
const mapStyle = 'mapbox://styles/ilabmedia/cjldtfvvu21jk2qqh0jh8drn1';

const appHeight = 600;
const containerStyle = {
  width: 'auto',
  height: '100%',
};


ReactDOM.render(
  <StyleRoot className="style-root" style={{ height: appHeight }}>
    <SearchView />
    <MapContainer
      accessToken={token}
      containerStyle={containerStyle}
      mapStyle={mapStyle}
      center={defaultCenter}
    />
    <MobilePlaceholder />
  </StyleRoot>,
  document.getElementById('app'),
);
