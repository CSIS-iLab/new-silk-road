import alt from '../alt';
import { CountrySource } from '../sources/apisources';
import createApiActions from './apiactions';

const CountryActions = alt.createActions(createApiActions(CountrySource));

export default CountryActions;
