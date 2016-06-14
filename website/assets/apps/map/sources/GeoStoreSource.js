import {GeoStoreSourceBase} from './apisources';

class GeoStoreSource extends GeoStoreSourceBase {
  static get(identifier) {
    let fetchURL = `${GeoStoreSource.baseURL}/${identifier}`;
    return fetch(fetchURL);
  }
}

export default GeoStoreSource;
