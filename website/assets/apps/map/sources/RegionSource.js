import 'whatwg-fetch';

export default class RegionSource {
  static fetch() {
    return fetch('/api/regions/');
  }
}
