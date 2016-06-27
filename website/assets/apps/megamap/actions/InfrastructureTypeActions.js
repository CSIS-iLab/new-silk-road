import alt from '../alt';
import {InfrastructureTypeSource} from '../sources/apisources';
import {createApiActions} from './apiactions';

var InfrastructureTypeActions = alt.createActions(createApiActions(InfrastructureTypeSource));

export default InfrastructureTypeActions;
