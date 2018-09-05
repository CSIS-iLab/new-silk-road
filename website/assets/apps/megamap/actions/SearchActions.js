/* eslint-disable class-methods-use-this */

import 'whatwg-fetch';
import alt from '../alt';
import { SearchSource } from '../sources/apisources';

class SearchActionsBase {

  update(data) {
    return data;
  }

  search(query) {
    return (dispatch) => {
      dispatch();
      SearchSource.fetch(query)
      .then(response => response.json())
      .then((json) => {
        json['query'] = query;
        this.update(json);
      })
      .catch((error) => {
        this.failed(error);
      });
    };
  }

  getQueryFromURL(url) {
    /* Take a URL (for an API call), and construct a query Object from it.
     * Notes:
     *   - Each parameter becomes its own key
     *   - Each value is an array
     *   - infrastructure_type is always returned. If it's not in the URL, then
     *     the value is an empty array.
     */
    let keyAndValue;
    let queryObject = {};
    const parameters = url.slice(url.indexOf('?') + 1).split('&');
    for (let i = 0; i < parameters.length; i++) {
      keyAndValue = parameters[i].split('=');
      const key = keyAndValue[0];

      // Try to convert the value to an integer
      let value;
      if (!isNaN(parseInt(keyAndValue[1]))) {
        value = parseInt(keyAndValue[1]);
      } else {
        // Converting the value to an integer results in NaN, so just use the (string) value
        value = keyAndValue[1];
      }

      // If the key already exists in the query object, then push the new value
      // into that array. Otherwise, add a new key to the query object, with the
      // value being an array of the 'value' variable.
      if (queryObject.hasOwnProperty(key)) {
        queryObject[key].push(value);
      } else {
        queryObject[key] = [value];
      }
    }

    // Delete the 'limit' and 'offset' keys, since we don't need them for the query
    delete queryObject['limit'];
    delete queryObject['offset'];
    // The queryObject will need to have an infrastructure_type key later, so if
    // it does not already exist, then add it here, and set it to an empty array.
    if (!queryObject.hasOwnProperty('infrastructure_type')) {
      queryObject['infrastructure_type'] = [];
    }

    return queryObject;
  }

  load(url) {
    this.query = this.getQueryFromURL(url);
    return (dispatch) => {
      dispatch();
      fetch(url)
      .then(response => response.json())
      .then((json) => {
        json['query'] = this.query;
        this.update(json);
      })
      .catch((error) => {
        this.failed(error);
      });
    };
  }

  failed(error) {
    return error;
  }
}

const SearchActions = alt.createActions(SearchActionsBase);
export default SearchActions;
