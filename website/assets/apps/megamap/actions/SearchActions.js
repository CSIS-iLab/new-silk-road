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
        this.update(json);
      })
      .catch((error) => {
        this.failed(error);
      });
    };
  }

  load(url) {
    return (dispatch) => {
      dispatch();
      fetch(url)
      .then(response => response.json())
      .then((json) => {
        SearchActionsBase.update(json);
      })
      .catch((error) => {
        SearchActionsBase.failed(error);
      });
    };
  }

  failed(error) {
    return error;
  }
}

const SearchActions = alt.createActions(SearchActionsBase);
export default SearchActions;
