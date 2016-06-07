import alt from '../alt';
import {SearchSource} from '../sources/apisources';
import 'whatwg-fetch';

class SearchActions {

  updateSearchResults(data) {
    return data;
  }

  search(query) {
    return (dispatch) => {
      dispatch();
      SearchSource.fetch(query)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.updateSearchResults(json);
      })
      .catch((errorMessage) => {
        this.searchFailed(errorMessage);
      })
    }
  }

  loadResults(url) {
    return (dispatch) => {
      dispatch();
      fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.updateSearchResults(json);
      })
      .catch((errorMessage) => {
        this.searchFailed(errorMessage);
      });
    }
  }

  searchFailed(errorMessage) {
    return errorMessage;
  }
}

SearchActions = alt.createActions(SearchActions);
export default SearchActions;
