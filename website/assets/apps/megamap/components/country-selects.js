import {createSelectContainer} from './containers';
import CountryStore from '../stores/CountryStore';
import CountryActions from '../actions/CountryActions';
import Option from '../models/Option';

var FunderCountrySelect = createSelectContainer(
  CountryStore, CountryActions,
  {
    selectName: 'funding__sources__countries',
    labelName: 'Country',
    selectMultiple: true,
    mapOptions: (data) => { return data.results.map((obj) => new Option(obj.name, obj.id)) },
  }
);

var ProjectCountrySelect = createSelectContainer(
  CountryStore, CountryActions,
  {
    selectName: 'countries',
    labelName: 'Country',
    selectMultiple: true,
    mapOptions: (data) => { return data.results.map((obj) => new Option(obj.name, obj.id)) },
  }
);

export {FunderCountrySelect, ProjectCountrySelect};
