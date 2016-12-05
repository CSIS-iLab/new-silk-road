import 'whatwg-fetch';
import parameterizeQuery from './utils';

function createApiSource(endpoint) {
  class ApiSource {
    static fetch(query) {
      let fetchURL = endpoint;
      if (query) {
        const queryString = parameterizeQuery(query);
        fetchURL = `${endpoint}?${queryString}`;
      }
      return fetch(fetchURL, { credentials: 'same-origin' });
    }
  }
  return ApiSource;
}

const CountrySource = createApiSource('/api/countries/');
const OrganizationSource = createApiSource('/api/organizations/');
const InfrastructureTypeSource = createApiSource('/api/infrastructure-types/');
const RegionSource = createApiSource('/api/regions/');
const StatusSource = createApiSource('/api/project-statuses/');
const SearchSource = createApiSource('/api/projects/');
const GeoCentroidSource = createApiSource('/api/geostore-centroids/');

export {
  createApiSource,
  CountrySource,
  OrganizationSource,
  InfrastructureTypeSource,
  RegionSource,
  StatusSource,
  SearchSource,
  GeoCentroidSource,
};
