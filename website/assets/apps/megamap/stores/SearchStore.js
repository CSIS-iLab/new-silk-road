import alt from '../alt';
import SearchActions from '../actions/SearchActions';

class SearchStoreBase {
  constructor() {
    this.results = [];
    this.next = null;
    this.previous = null;
    this.error = null;
    this.isSearching = false;
    this.searchCount = 0;

    this.bindListeners({
      handleSearch: SearchActions.SEARCH,
      handleSearchResults: SearchActions.UPDATE,
      handleSearchFail: SearchActions.FAILED,
    });
  }

  handleSearch() {
    this.results = [];
    this.next = null;
    this.previous = null;
    this.isSearching = true;
    this.searchCount += 1;
  }

  handleSearchResults(data) {
    this.results = data.results;
    this.next = data.next;
    this.previous = data.previous;
    this.error = null;
    this.isSearching = false;
  }

  handleSearchFail(error) {
    this.results = [];
    this.isSearching = false;
    this.error = error;
  }


}

const SearchStore = alt.createStore(SearchStoreBase, 'SearchStore');

export default SearchStore;
