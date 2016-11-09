import { createSelectContainer, nameIdMapper } from './containers';
import RegionStore from '../stores/RegionStore';
import RegionActions from '../actions/RegionActions';

const ProjectRegionSelect = createSelectContainer(
  RegionStore, RegionActions,
  {
    selectName: 'region',
    labelName: 'Region',
    selectMultiple: true,
    mapOptions: nameIdMapper,
  },
);

export default ProjectRegionSelect;
