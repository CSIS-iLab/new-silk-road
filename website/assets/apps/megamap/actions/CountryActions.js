import alt from '../alt';
import {CountrySource} from '../sources/apisources';
import {createApiActions} from './apiactions';

var CountryActions = alt.createActions(createApiActions(CountrySource));

export default CountryActions;
