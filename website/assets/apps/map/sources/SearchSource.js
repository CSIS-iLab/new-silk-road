import 'whatwg-fetch';

function parameterizeQuery(query) {
  let params = Object.keys(query).map((key) => {
    return query[key] ? [key, query[key]].join("=") : null;
  });
  return params.filter((value) => value !== null).join("&");
}

export default class SearchSource {
  static baseURL = '/api/projects/';
  static search(query) {
    let params = parameterizeQuery(query);
    let queryURL = `${SearchSource.baseURL}?${params}`;
    return fetch(queryURL);
  }
}
