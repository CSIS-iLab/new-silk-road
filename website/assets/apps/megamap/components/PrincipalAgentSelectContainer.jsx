import { createSelectContainer } from './containers';
import PrincipalAgentStore from '../stores/PrincipalAgentStore';
import PrincipalAgentActions from '../actions/PrincipalAgentActions';

const nameSlugMapper = data => data.results.map(
  obj => Object.create({ label: obj.name, value: obj.slug }),
);

const PrincipalAgentSelectContainer = createSelectContainer(
  PrincipalAgentStore, PrincipalAgentActions,
  {
    selectName: 'initiatives__principal_agent__slug',
    labelName: 'Principal Agent',
    fetchParams: { principal_initiatives__isnull: 'False' },
    mapOptions: nameSlugMapper,
  },
);

export default PrincipalAgentSelectContainer;
