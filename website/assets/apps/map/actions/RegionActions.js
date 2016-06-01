import alt from '../alt';
import RegionSource from '../sources/RegionSource';

class RegionActions {
  updateRegions(regions) {
    return regions;
  }

  fetchRegions() {
    return (dispatch) => {
      dispatch();
      RegionSource.fetch()
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          this.updateRegions(json);
        })
        .catch((errorMessage) => {
          this.regionsFailed(errorMessage)
        });
    }
  }

  regionsFailed(errorMessage) {
    return errorMessage;
  }
}

RegionActions = alt.createActions(RegionActions);

export default RegionActions;
