import "babel-polyfill";
import ReactDOM from "react-dom";
import React from "react";
import Map from "./components/map";
import SearchBox from "./components/SearchBox";
import Radium, { StyleRoot } from "radium";


const token = 'pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw';
const mapStyle = 'mapbox://styles/ilabmedia/cimxgcwgq00njp1nhlyb25pw4';

const appHeight = 600;
const containerStyle = {
  width: 'auto',
  height: '100%',
}


ReactDOM.render(
  <StyleRoot style={{height: appHeight}}>
    {/*<Map accessToken={token} containerStyle={containerStyle} mapStyle={mapStyle} />*/}
    <SearchBox maxHeight={appHeight} />
  </StyleRoot>,
  document.getElementById('app')
);
