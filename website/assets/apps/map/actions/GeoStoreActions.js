import alt from '../alt';
import GeoStoreSource from '../sources/GeoStoreSource';

class GeoStoreActions {
  selectGeoStoreId(identifier) {
    return identifier;
  }

  updateGeoStore(json) {
    return json;
  }

  getGeoStore(identifier) {
    return (dispatch) => {
      dispatch();
      GeoStoreSource.get(identifier)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.updateGeoStore(json);
      })
      .catch((error) => {
        this.fetchFailed(error);
      });
    }
  }

  fetchFailed(error) {
    return error;
  }

}

GeoStoreActions = alt.createActions(GeoStoreActions);
export default GeoStoreActions;
