import {createSelectContainer} from './containers';
import CountryStore from '../stores/CountryStore';
import CountryActions from '../actions/CountryActions';
import Option from '../models/Option';

var FunderCountrySelect = createSelectContainer(
  CountryStore, CountryActions,
  'funding__sources__countries__code', 'Country',
  function(data) {
    return data.results.map((obj) => new Option(obj.name, obj.alpha_3));
  }
);

var ProjectCountrySelect = createSelectContainer(
  CountryStore, CountryActions,
  'countries__code', 'Country',
  function(data) {
    return data.results.map((obj) => new Option(obj.name, obj.alpha_3));
  }
);

export {FunderCountrySelect, ProjectCountrySelect};
