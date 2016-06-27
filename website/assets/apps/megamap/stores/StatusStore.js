import alt from '../alt';
import {createApiStore} from './apistores';
import StatusActions from '../actions/StatusActions';


var StatusStore = createApiStore(StatusActions);
StatusStore = alt.createStore(StatusStore, 'StatusStore');

export default StatusStore;
