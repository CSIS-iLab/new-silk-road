import alt from '../alt';
import {createApiStore} from './apistores';
import CountryActions from '../actions/CountryActions';


var CountryStore = createApiStore(CountryActions);
CountryStore = alt.createStore(CountryStore, 'CountryStore');

export default CountryStore;
