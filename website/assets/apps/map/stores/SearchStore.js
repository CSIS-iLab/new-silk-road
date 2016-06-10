import alt from '../alt';
import SearchActions from '../actions/SearchActions';

class SearchStore {
  constructor() {
    this.results = [];
    this.next = null;
    this.previous = null;
    this.error = null;

    this.bindListeners({
      handleSearch: SearchActions.SEARCH,
      handleSearchResults: SearchActions.UPDATE,
      handleSearchFail: SearchActions.FAILED
    })
  }

  handleSearch() {
    this.results = [];
    this.next = null;
    this.previous = null;
  }

  handleSearchResults(data) {
    this.results = data.results;
    this.next = data.next;
    this.previous = data.previous;
    this.error = null;
  }

  handleSearchFail(error) {
    this.results = [];
    console.log(error);
    this.error = error;
  }


}

SearchStore = alt.createStore(SearchStore, 'SearchStore');

export default SearchStore;
