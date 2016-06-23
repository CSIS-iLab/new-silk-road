export default class GeoManager {
  constructor() {
    this._selectedGeo = null;
    this._geoReferences = new Map();
    this._selectedGeoReferences = new Set();
    this._layerIdentifiers = new Set();
  }

  _updateLayerIdentifiers(layerIds) {
    const updated = [...this._layerIdentifiers].concat(layerIds);
    this._layerIdentifiers = new Set(updated);
  }

  setGeoIdentifiers(identifiers) {
    this._geoIdentifiers = new Set(identifiers);
  }

  get layerIdentifiers() {
    return [...this._layerIdentifiers];
  }

  set selectedGeoIdentifiers(values) {
    this._selectedGeoReferences = new Set(values);
  }

  get selectedGeoIdentifiers() {
    if (this._selectedGeoReferences.size > 0) {
      return this._selectedGeoReferences;
    }
    return this._geoIdentifiers;
  }

  get selectedGeoStore() {
    return this._selectedGeo;
  }
  set selectedGeoStore(value) {
    this._selectedGeo = value;
  }

  get selectedGeoExtent() {
    return this._geoReferences.get(this._selectedGeo);
  }

  get loadedGeoIdentifiers() {
    return new Set(this._geoReferences.keys());
  }

  addGeoRecord(identifier, layerIds, extent) {
    this._geoReferences.set(identifier, extent);
    this._updateLayerIdentifiers(layerIds)
  }

  hasGeo(identifier) {
    return this._geoReferences.has(identifier);
  }
}
