/* eslint-disable class-methods-use-this */

import 'whatwg-fetch';
import alt from '../alt';
import { GeoCentroidSource } from '../sources/apisources';

class GeoCentroidActionsBase {

  update(data) {
    return data;
  }

  fetch(query) {
    return (dispatch) => {
      dispatch();
      GeoCentroidSource.fetch(query)
      .then(response => response.json())
      .then((json) => {
        this.update(json);
      })
      .catch((error) => {
        this.failed(error);
      });
    };
  }

  failed(error) {
    return error;
  }
}

const GeoCentroidActions = alt.createActions(GeoCentroidActionsBase);
export default GeoCentroidActions;
