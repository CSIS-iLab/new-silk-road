import alt from '../alt';
import CurrencyActions from '../actions/CurrencyActions';

class CurrencyStoreBase {

  constructor() {
    this.lookups = {};
    this.bindListeners({
      handleFetch: CurrencyActions.FETCH,
      handleUpdate: CurrencyActions.UPDATE,
    });
  }

  handleFetch() {
    this.lookups = {};
  }

  handleUpdate(lookups) {
    this.lookups = lookups;
  }
}

const CurrencyStore = alt.createStore(CurrencyStoreBase, 'CurrencyStore');

export default CurrencyStore;
