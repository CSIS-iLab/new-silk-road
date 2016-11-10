import alt from '../alt';
import createApiStore from './apistores';
import InfrastructureTypeActions from '../actions/InfrastructureTypeActions';


const InfrastructureTypeStore = alt.createStore(
  createApiStore(InfrastructureTypeActions),
  'InfrastructureTypeStore',
);

export default InfrastructureTypeStore;
