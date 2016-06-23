import alt from '../alt';
import {GeoCentroidSource} from '../sources/apisources';
import 'whatwg-fetch';

class GeoCentroidActions {

  update(data) {
    return data;
  }

  fetch(query) {
    return (dispatch) => {
      dispatch();
      GeoCentroidSource.fetch(query)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.update(json);
      })
      .catch((error) => {
        this.failed(error);
      })
    }
  }

  failed(error) {
    return error;
  }
}

GeoCentroidActions = alt.createActions(GeoCentroidActions);
export default GeoCentroidActions;
