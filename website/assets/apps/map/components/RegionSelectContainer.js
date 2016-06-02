import {createSelectContainer} from './containers';
import Option from '../models/Option';
import RegionStore from '../stores/RegionStore';
import RegionActions from '../actions/RegionActions';

var RegionSelectContainer = createSelectContainer(
  RegionStore, RegionActions,
  'regions', 'Regions',
  function(data) {
    return data.results.map((obj) => new Option(obj.name, obj.id));
  }
);

export default RegionSelectContainer;
