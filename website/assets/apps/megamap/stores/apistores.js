
function createApiStore(Actions) {
  class ApiStore {
    constructor() {
      this.results = [];
      this.error = null;

      this.bindListeners({
        handleFetch: Actions.FETCH,
        handleUpdate: Actions.UPDATE,
        handleFailed: Actions.FAILED,
      });
    }

    handleUpdate(results) {
      this.results = results;
      this.error = null;
    }

    handleFetch() {
      this.results = [];
    }

    handleFailed(error) {
      this.results = [];
      this.error = error;
    }
  }
  return ApiStore;
}

export default createApiStore;
