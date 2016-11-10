import alt from '../alt';
import createApiStore from './apistores';
import RegionActions from '../actions/RegionActions';

const RegionStore = alt.createStore(
  createApiStore(RegionActions),
  'RegionStore',
);

export default RegionStore;
