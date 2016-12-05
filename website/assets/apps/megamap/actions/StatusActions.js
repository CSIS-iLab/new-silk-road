import alt from '../alt';
import { StatusSource } from '../sources/apisources';
import createApiActions from './apiactions';

const StatusActions = alt.createActions(createApiActions(StatusSource));

export default StatusActions;
