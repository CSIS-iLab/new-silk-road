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
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          this.updateCountries(json);
        })
        .catch((errorMessage) => {
          this.countriesFailed(errorMessage)
        });
    }
  }

  countriesFailed(errorMessage) {
    return errorMessage;
  }
}

CountryActions = alt.createActions(CountryActions);

export default CountryActions;
