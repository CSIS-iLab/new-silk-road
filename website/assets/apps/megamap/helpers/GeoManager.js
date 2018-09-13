export default class GeoManager {
  constructor() {
    this.selectedGeo = null;
    this.geoReferences = new Map();
    this.selectedGeoReferences = new Set();
    this.layerIds = new Set();
  }

  updateLayerIdentifiers(layerIds) {
    const updated = [...this.layerIds].concat(layerIds);
    this.layerIds = new Set(updated);
  }

  setGeoIdentifiers(identifiers) {
    this.geoIdentifiers = new Set(identifiers);
  }

  addGeoIdentifiers(identifiers) {
    if (this.geoIdentifiers) {
      const newIdentifiersSet = [...this.geoIdentifiers].concat(identifiers);
      this.geoIdentifiers = newIdentifiersSet;
    } else {
      this.geoIdentifiers = new Set(identifiers);
    }
  }

  get layerIdentifiers() {
    return [...this.layerIds];
  }

  set selectedGeoIdentifiers(values) {
    this.selectedGeoReferences = new Set(values);
  }

  get selectedGeoIdentifiers() {
    if (this.selectedGeoReferences.size > 0) {
      return this.selectedGeoReferences;
    }
    return this.geoIdentifiers;
  }

  get selectedGeoStore() {
    return this.selectedGeo;
  }
  set selectedGeoStore(value) {
    this.selectedGeo = value;
  }

  get selectedGeoExtent() {
    return this.geoReferences.get(this.selectedGeo);
  }

  get loadedGeoIdentifiers() {
    return new Set(this.geoReferences.keys());
  }

  addGeoRecord(identifier, layerIds, extent) {
    this.geoReferences.set(identifier, extent);
    this.updateLayerIdentifiers(layerIds);
  }

  hasGeo(identifier) {
    return this.geoReferences.has(identifier);
  }
}
