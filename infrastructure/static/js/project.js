function ProjectMap(mapboxgl, config) {
  this.mapboxgl = mapboxgl;
  this.popup = null;
  this.map = null;
  this.debug = config.debug || false;

  this.map = new mapboxgl.Map({
    container: config.container || null,
    style: config.style || null,
    center: config.center || null
  });
  this.map.addControl(new mapboxgl.Navigation({position: 'top-left'}));
}

ProjectMap.prototype = {
  addLayers: function(mapLayers, bounds) {
    this._mapLayers = mapLayers;
    this._bounds = bounds || null;
    var self = this;

    for (var i = 0; i < self._mapLayers.length; i++) {
      var lyr = self._mapLayers[i];
      self.map.addSource(lyr.layer.source, lyr.src);
      self.map.addLayer(lyr.layer);
    }
    if (self._bounds) {
      self.map.fitBounds(self._bounds.bbox, self._bounds);
    }
  },

  setPopupLayers: function(layerNames) {
    this._markerLayers = layerNames
    var self = this;
    this.map.on('click', function (e) {
      var features = self.map.queryRenderedFeatures(e.point, { layers: self._markerLayers });
      if (!features.length) {
        return;
      }
      var feature = features[0];
      var featureText = feature.properties.label || null;
      if (self.debug) console.log(featureText);
      if (featureText) {
        if (self.debug) console.log(feature.geometry.coordinates);
        self.popup = new self.mapboxgl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setText(featureText)
        .addTo(self.map);
        if (self.debug) console.log(self.popup);
      }
    });
  }
};
