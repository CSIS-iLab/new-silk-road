import 'whatwg-fetch';
import {parameterizeQuery} from './utils';

function createApiSource(endpoint) {
  class ApiSource {
    static baseURL = endpoint;
    static fetch(query) {
      let fetchURL = ApiSource.baseURL;
      if (query) {
        const queryString = parameterizeQuery(query);
        fetchURL = `${ApiSource.baseURL}?${queryString}`;
      }
      return fetch(fetchURL);
    }
  }
  return ApiSource;
}

var CountrySource = createApiSource('/api/countries/');
var OrganizationSource = createApiSource('/api/organizations/');
var InfrastructureTypeSource = createApiSource('/api/infrastructure-types/');
var RegionSource = createApiSource('/api/regions/');
var StatusSource = createApiSource('/api/project-statuses/');
var SearchSource = createApiSource('/api/projects/');
var GeoCentroidSource = createApiSource('/api/geostore-centroids/');
var GeoStoreSourceBase = createApiSource('/api/geostore/');

export {
  createApiSource,
  CountrySource,
  OrganizationSource,
  InfrastructureTypeSource,
  RegionSource,
  StatusSource,
  SearchSource,
  GeoCentroidSource,
  GeoStoreSourceBase
};
