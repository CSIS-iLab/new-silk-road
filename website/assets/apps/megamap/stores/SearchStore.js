import alt from '../alt';
import SearchActions from '../actions/SearchActions';

class SearchStoreBase {
  constructor() {
    this.total = null;
    this.results = [];
    this.next = null;
    this.previous = null;
    this.error = null;
    this.isSearching = false;
    this.searchCount = 0;
    this.layerIds = [];

    this.bindListeners({
      handleSearch: SearchActions.SEARCH,
      handleSearchResults: SearchActions.UPDATE,
      handleSearchFail: SearchActions.FAILED,
      handleSearchClear: SearchActions.CLEAR,
    });
  }

  handleSearch() {
    this.total = null;
    this.results = [];
    this.next = null;
    this.previous = null;
    this.isSearching = true;
    this.searchCount += 1;
    this.query = {};
  }

  handleSearchResults(data) {
    this.total = data.count;
    this.results = data.results;
    this.next = data.next;
    this.previous = data.previous;
    this.error = null;
    this.isSearching = false;
    this.query = data.query;
  }

  handleSearchFail(error) {
    this.results = [];
    this.isSearching = false;
    this.error = error;
  }

  handleSearchClear() {
    this.total = null;
    this.results = [];
    this.next = null;
    this.previous = null;
    this.error = null;
    this.isSearching = false;
    this.query = {};
    this.searchCount = 0;
  }
}

const SearchStore = alt.createStore(SearchStoreBase, 'SearchStore');

export default SearchStore;
