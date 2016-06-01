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
          let countries = json.map(function(obj) {
            return {name: obj.name, value: obj.alpha_3};
          });
          this.updateCountries(countries);
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
