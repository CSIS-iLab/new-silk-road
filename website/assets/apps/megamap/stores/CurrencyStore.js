import alt from '../alt';
import CurrencyActions from '../actions/CurrencyActions';

class CurrencyStore {

  constructor() {
    this.lookups = {};
    this.bindListeners({
      handleFetch: CurrencyActions.FETCH,
      handleUpdate: CurrencyActions.UPDATE
    })
  }

  handleFetch() {
    this.lookups = {};
  }

  handleUpdate(lookups) {
    this.lookups = lookups;
  }
}

CurrencyStore = alt.createStore(CurrencyStore, 'CurrencyStore');

export default CurrencyStore;
