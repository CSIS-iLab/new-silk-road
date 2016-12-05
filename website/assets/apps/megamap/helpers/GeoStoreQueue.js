import Queue from 'promise-queue';
import GeoStoreActions from '../actions/GeoStoreActions';

const maxConcurrent = 6;
const maxQueue = Infinity;

export default class GeoStoreQueue {
  constructor() {
    this.id_q = new Set();
    this.q = new Queue(maxConcurrent, maxQueue);
  }

  loadGeoStore(id) {
    if (!this.id_q.has(id)) {
      this.id_q.add(id);
      this.q.add(() => {
        GeoStoreActions.getGeoStore(id);
      });
    }
  }

  resolveGeoStore(identifier) {
    this.id_q.delete(identifier);
  }

}
