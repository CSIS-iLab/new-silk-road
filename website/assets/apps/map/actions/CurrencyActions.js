import alt from '../alt';
import CurrencySource from '../sources/CurrencySource';

class CurrencyActions {

  update(data) {
    return data;
  }

  fetch() {
    return (dispatch) => {
      dispatch();
      CurrencySource.fetch()
      .then((lookups) => {
        this.update(lookups);
      })
      .catch((errorMessage) => {
        this.failed(errorMessage);
      })
    }
  }

  failed(errorMessage) {
    return errorMessage;
  }
}

CurrencyActions = alt.createActions(CurrencyActions);
export default CurrencyActions;
