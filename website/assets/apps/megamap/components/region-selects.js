import {createSelectContainer} from './containers';
import Option from '../models/Option';
import RegionStore from '../stores/RegionStore';
import RegionActions from '../actions/RegionActions';

var ProjectRegionSelect = createSelectContainer(
  RegionStore, RegionActions,
  {
    selectName: 'region',
    labelName: 'Region',
    selectMultiple: true,
    mapOptions: (data) => { return data.results.map((obj) => new Option(obj.name, obj.id)) },
  }
);

export {ProjectRegionSelect};
