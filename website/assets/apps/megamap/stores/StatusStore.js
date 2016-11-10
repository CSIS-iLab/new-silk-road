import alt from '../alt';
import createApiStore from './apistores';
import StatusActions from '../actions/StatusActions';


const StatusStore = alt.createStore(
  createApiStore(StatusActions),
  'StatusStore',
);

export default StatusStore;
