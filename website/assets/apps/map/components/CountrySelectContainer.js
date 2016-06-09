import {createSelectContainer} from './containers';
import CountryStore from '../stores/CountryStore';
import CountryActions from '../actions/CountryActions';
import Option from '../models/Option';

var CountrySelectContainer = createSelectContainer(
  CountryStore, CountryActions,
  'funding__sources__countries__code', 'Country',
  function(data) {
    return data.results.map((obj) => new Option(obj.name, obj.alpha_3));
  }
);

export default CountrySelectContainer;
