import 'whatwg-fetch';

export default class CountrySource {
  static fetch() {
    return fetch('/api/countries/');
  }
}
