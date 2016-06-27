import alt from '../alt';
import {createApiStore} from './apistores';
import InfrastructureTypeActions from '../actions/InfrastructureTypeActions';


var InfrastructureTypeStore = createApiStore(InfrastructureTypeActions);
InfrastructureTypeStore = alt.createStore(InfrastructureTypeStore, 'InfrastructureTypeStore');

export default InfrastructureTypeStore;
