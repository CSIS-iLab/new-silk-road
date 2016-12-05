import alt from '../alt';
import createApiStore from './apistores';
import PrincipalAgentActions from '../actions/PrincipalAgentActions';

const PrincipalAgentStore = alt.createStore(
  createApiStore(PrincipalAgentActions),
  'PrincipalAgentStore',
);

export default PrincipalAgentStore;
