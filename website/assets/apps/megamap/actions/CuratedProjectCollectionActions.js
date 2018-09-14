import alt from '../alt';
import { CuratedProjectCollectionSource } from '../sources/apisources';
import createApiActions from './apiactions';

const CuratedProjectCollectionActions = alt.createActions(createApiActions(CuratedProjectCollectionSource));

export default CuratedProjectCollectionActions;
