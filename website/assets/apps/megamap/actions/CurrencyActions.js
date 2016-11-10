/* eslint-disable class-methods-use-this */

import alt from '../alt';
import CurrencySource from '../sources/CurrencySource';

class CurrencyActionsBase {

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
      .catch((error) => {
        this.failed(error);
      });
    };
  }

  failed(error) {
    return error;
  }
}

const CurrencyActions = alt.createActions(CurrencyActionsBase);
export default CurrencyActions;
