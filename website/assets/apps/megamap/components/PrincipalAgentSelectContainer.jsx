import {createSelectContainer} from './containers';
import PrincipalAgentStore from '../stores/PrincipalAgentStore';
import PrincipalAgentActions from '../actions/PrincipalAgentActions';
import Option from '../models/Option';

var PrincipalAgentSelectContainer = createSelectContainer(
  PrincipalAgentStore, PrincipalAgentActions,
  {
    selectName: 'initiatives__principal_agent__slug',
    labelName: 'Principal Agent',
    fetchParams: {'principal_initiatives__isnull': 'False'},
    mapOptions: (data) => { return data.results.map((obj) => new Option(obj.name, obj.slug)) },
  }
);

export default PrincipalAgentSelectContainer;
