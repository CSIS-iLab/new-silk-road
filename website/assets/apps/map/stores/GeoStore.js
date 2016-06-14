import alt from '../alt';
import GeoStoreActions from '../actions/GeoStoreActions';

class GeoStore {
  constructor() {
    this.geoStoreId = null;
    this.geoStore = null;

    this.bindListeners({
      handleSelectGeoStoreId: GeoStoreActions.SELECT_GEO_STORE_ID,
      handleUpateGeoStore: GeoStoreActions.UPDATE_GEO_STORE
    });
  }

  handleSelectGeoStoreId(identifier) {
    this.geoStoreId = identifier;
  }

  handleUpateGeoStore(json) {
    this.geoStore = json;
  }
}

GeoStore = alt.createStore(GeoStore, 'GeoStore');

export default GeoStore;
