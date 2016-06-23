import {createSelectContainer} from './containers';
import Option from '../models/Option';
import InfrastructureTypeStore from '../stores/InfrastructureTypeStore';
import InfrastructureTypeActions from '../actions/InfrastructureTypeActions';

var InfrastructureTypeSelectContainer = createSelectContainer(
  InfrastructureTypeStore, InfrastructureTypeActions,
  'infrastructure_type', 'Infrastructure Type',
  function(data) {
    return data.results.map((obj) => new Option(obj.name, obj.id));
  }
);

export default InfrastructureTypeSelectContainer;
