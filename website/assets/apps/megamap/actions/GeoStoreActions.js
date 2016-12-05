/* eslint-disable class-methods-use-this */

import alt from '../alt';
import GeoStoreSource from '../sources/GeoStoreSource';

class GeoStoreActionsBase {
  selectGeoStoreId(identifier) {
    return identifier;
  }

  didGetGeoStore(json) {
    return json;
  }

  getGeoStore(identifier) {
    return (dispatch) => {
      dispatch();
      GeoStoreSource.get(identifier)
      .then(response => response.json())
      .then((json) => {
        this.didGetGeoStore(json);
      })
      .catch((error) => {
        this.fetchFailed(error);
      });
    };
  }

  fetchFailed(error) {
    return error;
  }

}

const GeoStoreActions = alt.createActions(GeoStoreActionsBase);
export default GeoStoreActions;
