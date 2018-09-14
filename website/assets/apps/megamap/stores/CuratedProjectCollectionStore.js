import alt from '../alt';
import createApiStore from './apistores';
import CuratedProjectCollectionActions from '../actions/CuratedProjectCollectionActions';

const CuratedProjectCollectionStore = alt.createStore(
  createApiStore(CuratedProjectCollectionActions),
  'CuratedProjectCollectionStore',
);

export default CuratedProjectCollectionStore;
