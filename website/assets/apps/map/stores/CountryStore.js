import alt from '../alt';
import CountryActions from '../actions/CountryActions';

class CountryStore {
  constructor() {
    this.countries = [];
    this.errorMessage = null;

    this.bindListeners({
      handleUpdateCountries: CountryActions.UPDATE_COUNTRIES,
      handleFetchCountries: CountryActions.FETCH_COUNTRIES,
      handleCountriesFailed: CountryActions.COUNTRIES_FAILED
    })
  }

  handleUpdateCountries(countries) {
    this.countries = countries;
    this.errorMessage = null;
  }

  handleFetchCountries() {
    this.countries = [];
  }

  handleCountriesFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

CountryStore = alt.createStore(CountryStore, 'CountryStore');

export default CountryStore;
