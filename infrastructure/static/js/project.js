var projectmap = {
  createMap: function (mapboxgl, config) {
    var mapConfig = {
      container: config.container,
      style: 'mapbox://styles/mapbox/streets-v8',
    };
    if ("center" in config) mapConfig["center"] = config.center;
    var map = new mapboxgl.Map(mapConfig);
    map.addControl(new mapboxgl.Navigation({position: 'top-left'}));

    map.on('style.load', function () {
      if ("mapLayers" in config) {
        for (var i = 0; i < config.mapLayers.length; i++) {
          var lyr = config.mapLayers[i];
          map.addSource(lyr.layer.source, lyr.src);
          map.addLayer(lyr.layer);
        }
      }
      if ("bounds" in config) {
        map.fitBounds(config.bounds.bbox, config.bounds);
      }
    });
    if("markerLayers" in config && config.markerLabels == true) {
      map.on('click', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: config.markerLayers });
        if (!features.length) {
          return;
        }
        var feature = features[0];
        // var featureHTML = "<p>" + feature.properties.label + "</p>";
        var popup = new mapboxgl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML("<p>Hello</p>")
        .addTo(map);
      });
    }
    return map;
  }
}
