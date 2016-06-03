import alt from '../alt';
import {SearchSource} from '../sources/apisources';

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

  searchFailed(errorMessage) {
    return errorMessage;
  }
}

SearchActions = alt.createActions(SearchActions);
export default SearchActions;
