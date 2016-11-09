import { createSelectContainer, nameIdMapper } from './containers';
import StatusStore from '../stores/StatusStore';
import StatusActions from '../actions/StatusActions';

const StatusSelectContainer = createSelectContainer(
  StatusStore, StatusActions,
  {
    selectName: 'status',
    labelName: 'Status',
    selectMultiple: true,
    mapOptions: nameIdMapper,
  },
);

export default StatusSelectContainer;
