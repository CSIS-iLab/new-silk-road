import { createSelectContainer, nameIdMapper } from './containers';
import CountryStore from '../stores/CountryStore';
import CountryActions from '../actions/CountryActions';

const FunderCountrySelect = createSelectContainer(
  CountryStore, CountryActions,
  {
    selectName: 'funding__sources__countries',
    labelName: 'Country',
    selectMultiple: true,
    mapOptions: nameIdMapper,
  },
);

const ProjectCountrySelect = createSelectContainer(
  CountryStore, CountryActions,
  {
    selectName: 'countries',
    labelName: 'Country',
    selectMultiple: true,
    mapOptions: nameIdMapper,
  },
);

export { FunderCountrySelect, ProjectCountrySelect };
