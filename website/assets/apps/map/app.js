import "babel-polyfill";
import ReactDOM from "react-dom";
import React from "react";
import Map from "./components/map";
import SearchBox from "./components/searchbox";

const token = 'pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw';
const mapStyle = 'mapbox://styles/ilabmedia/cimxgcwgq00njp1nhlyb25pw4';
const containerStyle = {
  width: 'auto',
  height: 600,
}


ReactDOM.render(
  <div>
    <SearchBox />
    {/*<Map accessToken={token} containerStyle={containerStyle} mapStyle={mapStyle} />*/}
  </div>,
  document.getElementById('app')
);
