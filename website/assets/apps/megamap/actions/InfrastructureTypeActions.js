import alt from '../alt';
import { InfrastructureTypeSource } from '../sources/apisources';
import createApiActions from './apiactions';

const InfrastructureTypeActions = alt.createActions(createApiActions(InfrastructureTypeSource));

export default InfrastructureTypeActions;
