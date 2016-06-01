import alt from '../alt';
import RegionActions from '../actions/RegionActions';

class RegionStore {
  constructor() {
    this.regions = [];
    this.errorMessage = null;

    this.bindListeners({
      handleUpdateregions: RegionActions.UPDATE_REGIONS,
      handleFetchregions: RegionActions.FETCH_REGIONS,
      handleregionsFailed: RegionActions.REGIONS_FAILED
    })
  }

  handleUpdateregions(regions) {
    this.regions = regions;
    this.errorMessage = null;
  }

  handleFetchregions() {
    this.regions = [];
  }

  handleregionsFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

RegionStore = alt.createStore(RegionStore, 'RegionStore');

export default RegionStore;
