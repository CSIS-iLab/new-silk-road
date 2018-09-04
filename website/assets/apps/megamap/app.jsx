import 'babel-polyfill';
import ReactDOM from 'react-dom';
import React from 'react';
import { StyleRoot } from 'radium';
import MapContainer from './components/MapContainer';
import SearchView from './components/SearchView';
import { defaultCenter } from './helpers/map-constants';

const token = 'pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw';
const mapStyle = 'mapbox://styles/ilabmedia/cinm5o9pu001tbom67ql6snhg';

const appHeight = 600;
const containerStyle = {
  width: 'auto',
  height: '100%',
};


ReactDOM.render(
  <StyleRoot style={{ height: appHeight }}>
    <SearchView />
    <MapContainer
      accessToken={token}
      containerStyle={containerStyle}
      mapStyle={mapStyle}
      center={defaultCenter}
    />
  </StyleRoot>,
  document.getElementById('app'),
);
