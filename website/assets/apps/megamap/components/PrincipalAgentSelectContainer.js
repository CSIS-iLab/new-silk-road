import {createSelectContainer} from './containers';
import PrincipalAgentStore from '../stores/PrincipalAgentStore';
import PrincipalAgentActions from '../actions/PrincipalAgentActions';
import Option from '../models/Option';

var PrincipalAgentSelectContainer = createSelectContainer(
  PrincipalAgentStore, PrincipalAgentActions,
  'principal_agent__name', 'Principal Agent',
  function(data) {
    return data.results.map((obj) => new Option(obj.name, obj.slug));
  },
  {'principal_initiatives__isnull': 'False'}
);

export default PrincipalAgentSelectContainer;
