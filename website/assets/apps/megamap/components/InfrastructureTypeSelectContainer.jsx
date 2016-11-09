import { createSelectContainer, nameIdMapper } from './containers';
import InfrastructureTypeStore from '../stores/InfrastructureTypeStore';
import InfrastructureTypeActions from '../actions/InfrastructureTypeActions';

const InfrastructureTypeSelectContainer = createSelectContainer(
  InfrastructureTypeStore, InfrastructureTypeActions,
  {
    selectName: 'infrastructure_type',
    labelName: 'Infrastructure Type',
    selectMultiple: true,
    mapOptions: nameIdMapper,
  },
);

export default InfrastructureTypeSelectContainer;
