import 'whatwg-fetch';

function createApiSource(endpoint) {
  class ApiSource {
    static fetch() {
      return fetch(endpoint);
    }
  }
  return ApiSource;
}

var CountrySource = createApiSource('/api/countries/');
var InfrastructureTypeSource = createApiSource('/api/infrastructure-types/');
var RegionSource = createApiSource('/api/regions/');
var StatusSource = createApiSource('/api/project-statuses/');

export {
  createApiSource,
  CountrySource,
  InfrastructureTypeSource,
  RegionSource,
  StatusSource
};
