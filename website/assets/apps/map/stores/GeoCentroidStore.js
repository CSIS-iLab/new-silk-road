import alt from '../alt';
import GeoCentroidActions from '../actions/GeoCentroidActions';

class GeoCentroidStore {
  constructor() {
    this.geo = null;
    this.errorMessage = null;

    this.bindListeners({
      handleFetchCentroids: GeoCentroidActions.FETCH,
      handleCentroidsUpdate: GeoCentroidActions.UPDATE
    })
  }

  handleFetchCentroids() {
    this.geo = null;
  }

  handleCentroidsUpdate(data) {
    this.geo = data;
    this.errorMessage = null;
  }

}

GeoCentroidStore = alt.createStore(GeoCentroidStore, 'GeoCentroidStore');

export default GeoCentroidStore;
