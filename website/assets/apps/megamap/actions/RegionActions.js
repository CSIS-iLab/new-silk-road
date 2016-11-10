import alt from '../alt';
import { RegionSource } from '../sources/apisources';
import createApiActions from './apiactions';

const RegionActions = alt.createActions(createApiActions(RegionSource));

export default RegionActions;
