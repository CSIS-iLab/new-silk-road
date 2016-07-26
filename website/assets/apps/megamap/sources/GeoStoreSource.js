import 'whatwg-fetch';

class GeoStoreSource {
  static baseURL = '/api/geostore/';

  static get(identifier) {
    let fetchURL = `${GeoStoreSource.baseURL}${identifier}/`;
    return fetch(fetchURL, { credentials: 'same-origin',});
  }
}

export default GeoStoreSource;
