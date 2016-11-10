import alt from '../alt';
import createApiStore from './apistores';
import CountryActions from '../actions/CountryActions';


const CountryStore = alt.createStore(
  createApiStore(CountryActions),
  'CountryStore',
);

export default CountryStore;
