import 'whatwg-fetch';

class GeoStoreSource {

  static get(identifier) {
    const fetchURL = `/api/geostore/${identifier}/`;
    return fetch(fetchURL, { credentials: 'same-origin' });
  }
}

export default GeoStoreSource;
