(function (exports) {
  var root = exports;

  exports.debug = false;

  exports.sourceForGeoJSON = function (url) {
    return {
      'data': url,
      'type': 'geojson'
    }
  }

  exports.layerFromSource = function (layerId, sourceName, type, paintDef, layoutDef) {
    var layer =  {
      'id': layerId,
      'source': sourceName,
      'type': type
    };
    if (paintDef) layer['paint'] = paintDef;
    if (layoutDef) layer['layout'] = layoutDef;

    return layer;
  }

  exports.createPopUpHandlerForLayers = function (mapboxgl, map, layers, labelCreator) {
    var context = (function(mapboxgl, map, layers, labelCreator){
      this.mapboxgl = mapboxgl;
      this.map = map;
      this.layers = layers;
      this.labelCreator = labelCreator
    })(mapboxgl, map, layers, labelCreator);

    var popupHandler = function (e) {
      var features = context.map.queryRenderedFeatures(e.point, { layers: context.layers });
      if (!features.length) {
        return;
      }
      var feature = features[0];
      var featureText = textLabelCreator(feature);
      if (featureText) {
        if (root.debug === true) console.log(feature.geometry.coordinates);
        var popup = new context.mapboxgl.Popup()
                        .setLngLat(feature.geometry.coordinates)
                        .setText(featureText);

        popup.addTo(context.map);
      }
    };
    return popupHandler;
  }
})(this.MapUtils = {});
