import alt from '../alt';
import {createApiStore} from './apistores';
import RegionActions from '../actions/RegionActions';

var RegionStore = createApiStore(RegionActions);
RegionStore = alt.createStore(RegionStore, 'RegionStore');

export default RegionStore;
