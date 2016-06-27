import alt from '../alt';
import GeoCentroidActions from '../actions/GeoCentroidActions';

class GeoCentroidStore {
  constructor() {
    this.geo = null;
    this.error = null;

    this.bindListeners({
      handleFetchCentroids: GeoCentroidActions.FETCH,
      handleCentroidsUpdate: GeoCentroidActions.UPDATE,
      handleFailed: GeoCentroidActions.FAILED
    })
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

GeoCentroidStore = alt.createStore(GeoCentroidStore, 'GeoCentroidStore');

export default GeoCentroidStore;
