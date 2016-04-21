'use strict';

var MapMaker = function(mbgl) {
  this.mapboxgl = mbgl
  this._map = null;
  this.debug = false;

  Object.defineProperty(this, 'map', {
    get: function() {
      return this._map;
    },
    set: function(value) {
      if (map instanceof this.mapboxgl.Map) {
        this._map = map;
      } else {
        throw new Error('MapMaker.setMap requires a mapboxgl.Map instance');
      }
    }
  });
}

MapMaker.prototype.makeMap = function (options) {
  this._map = new this.mapboxgl.Map(options);
  return this._map;
};

MapMaker.prototype.createGeoJSONOptions = function (data) {
  return {
    'data': data,
    'type': 'geojson'
  };
};

MapMaker.prototype.createGeoJSONSource = function(url) {
  return new this.mapboxgl.GeoJSONSource(this.createGeoJSONOptions(url));
}

MapMaker.prototype.layerFromSource = function (layerId, sourceName, type, paintDef, layoutDef) {
  var layer =  {
    'id': layerId,
    'source': sourceName,
    'type': type
  };
  if (paintDef) layer['paint'] = paintDef;
  if (layoutDef) layer['layout'] = layoutDef;

  return layer;
};

MapMaker.prototype.createPopUpHandlerForLayers = function (layers, labelCreator, map) {
  var root = this;
  var ctx = {
    layers: layers,
    labelCreator: labelCreator,
    map: map || root.map
  }
  if (!(ctx.map instanceof this.mapboxgl.Map)) {
    throw new Error('MapMaker.createPopUpHandlerForLayers requires a mapboxgl.Map instance if MapMaker.map not set');
  }
  var popupHandler = function (e) {
    var features = ctx.map.queryRenderedFeatures(e.point, { layers: ctx.layers });
    if (!features.length) {
      return;
    }
    var feature = features[0];
    var featureHTML = ctx.labelCreator(feature);
    if (root.debug === true) console.log(featureHTML);
    if (featureHTML) {
      if (root.debug === true) console.log(feature.geometry.coordinates);
      var popup = new root.mapboxgl.Popup()
                      .setLngLat(feature.geometry.coordinates)
                      .setHTML(featureHTML);

      popup.addTo(root.map);
      if (root.debug) console.log(popup);
    }
  };
  return popupHandler;

};
