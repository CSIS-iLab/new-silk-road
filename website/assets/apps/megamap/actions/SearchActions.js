import alt from '../alt';
import {SearchSource} from '../sources/apisources';
import 'whatwg-fetch';

class SearchActions {

  update(data) {
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
        this.update(json);
      })
      .catch((error) => {
        this.failed(error);
      })
    }
  }

  load(url) {
    return (dispatch) => {
      dispatch();
      fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.update(json);
      })
      .catch((error) => {
        this.failed(error);
      });
    }
  }

  failed(error) {
    return error;
  }
}

SearchActions = alt.createActions(SearchActions);
export default SearchActions;
