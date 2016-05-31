import alt from '../alt';
import CountrySource from '../sources/CountrySource';

class CountryActions {
  updateCountries(countries) {
    return countries;
  }

  fetchCountries() {
    return (dispatch) => {
      dispatch();
      CountrySource.fetch()
        .then((countries) => {
          this.updateCountries(countries);
        })
        .catch((errorMessage) => {
          this.countriesFailed(message)
        });
    }
  }

  countriesFailed(errorMessage) {
    return errorMessage;
  }
}

CountryActions = alt.createActions(CountryActions);

export default CountryActions;
