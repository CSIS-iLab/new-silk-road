import Queue from 'promise-queue';
import GeoStoreActions from '../actions/GeoStoreActions';

const maxConcurrent = 6;
const maxQueue = Infinity;

export default class GeoStoreQueue {
  constructor() {
    this._id_q = new Set();
    this._q = new Queue(maxConcurrent, maxQueue);
  }

  loadGeoStore(id) {
    if (!this._id_q.has(id)) {
      this._id_q.add(id);
      this._q.add(() => {
        GeoStoreActions.getGeoStore(id);
      });
    }
  }

  resolveGeoStore(identifier) {
    this._id_q.delete(identifier);
  }

}
