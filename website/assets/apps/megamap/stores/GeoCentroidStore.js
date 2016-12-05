import alt from '../alt';
import GeoCentroidActions from '../actions/GeoCentroidActions';

class GeoCentroidStoreBase {
  constructor() {
    this.geo = null;
    this.error = null;

    this.bindListeners({
      handleFetchCentroids: GeoCentroidActions.FETCH,
      handleCentroidsUpdate: GeoCentroidActions.UPDATE,
      handleFailed: GeoCentroidActions.FAILED,
    });
  }

  handleFetchCentroids() {
    this.geo = null;
  }

  handleCentroidsUpdate(data) {
    this.geo = data;
    this.error = null;
  }

  handleFailed(error) {
    this.geo = null;
    this.error = error;
  }

}

const GeoCentroidStore = alt.createStore(GeoCentroidStoreBase, 'GeoCentroidStore');

export default GeoCentroidStore;
