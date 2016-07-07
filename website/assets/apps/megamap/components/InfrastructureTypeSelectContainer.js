import {createSelectContainer} from './containers';
import Option from '../models/Option';
import InfrastructureTypeStore from '../stores/InfrastructureTypeStore';
import InfrastructureTypeActions from '../actions/InfrastructureTypeActions';

var InfrastructureTypeSelectContainer = createSelectContainer(
  InfrastructureTypeStore, InfrastructureTypeActions,
  {
    selectName: 'infrastructure_type',
    labelName: 'Infrastructure Type',
    selectMultiple: true,
    mapOptions: (data) => { return data.results.map((obj) => new Option(obj.name, obj.id)) },
  }
);

export default InfrastructureTypeSelectContainer;
