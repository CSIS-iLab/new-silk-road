import alt from '../alt';
import {createApiStore} from './apistores';
import PrincipalAgentActions from '../actions/PrincipalAgentActions';

var PrincipalAgentStore = createApiStore(PrincipalAgentActions);
PrincipalAgentStore = alt.createStore(PrincipalAgentStore, 'PrincipalAgentStore');

export default PrincipalAgentStore;
