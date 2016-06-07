import alt from '../alt';
import SearchActions from '../actions/SearchActions';

class SearchStore {
  constructor() {
    this.count = 0;
    this.results = [];
    this.next = null;
    this.previous = null;
    this.errorMessage = null;

    this.bindListeners({
      handleSearch: SearchActions.SEARCH,
      handleSearchResults: SearchActions.UPDATE_SEARCH_RESULTS
    })
  }

  handleSearch() {
    this.results = [];
    this.next = null;
    this.previous = null;
  }

  handleSearchResults(data) {
    this.results = data.results;
    this.count = data.count;
    this.next = data.next;
    this.previous = data.previous;
    this.errorMessage = null;
  }


}

SearchStore = alt.createStore(SearchStore, 'SearchStore');

export default SearchStore;
