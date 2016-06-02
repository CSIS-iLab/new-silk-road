
function createApiStore(Actions) {
  class ApiStore {
    constructor() {
      this.results = [];
      this.errorMessage = null;

      this.bindListeners({
        handleFetch: Actions.FETCH,
        handleUpdate: Actions.UPDATE,
        handleFailed: Actions.FAILED
      })
    }

    handleUpdate(results) {
      this.results = results;
      this.errorMessage = null;
    }

    handleFetch() {
      this.results = [];
    }

    handleFailed(errorMessage) {
      this.errorMessage = errorMessage;
    }
  }
  return ApiStore;
}

export { createApiStore };
