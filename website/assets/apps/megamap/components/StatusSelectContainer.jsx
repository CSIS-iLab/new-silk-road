import {createSelectContainer} from './containers';
import Option from '../models/Option';
import StatusStore from '../stores/StatusStore';
import StatusActions from '../actions/StatusActions';

var StatusSelectContainer = createSelectContainer(
  StatusStore, StatusActions,
  {
    selectName: 'status',
    labelName: 'Status',
    selectMultiple: true,
    mapOptions: (data) => { return data.results.map((obj) => new Option(obj.name, obj.id)) },
  }
);

export default StatusSelectContainer;
