

function createApiActions(Source) {
  class ApiActions {
    update(x) {
      return x;
    }

    fetch() {
      return (dispatch) => {
        dispatch();
        Source.fetch()
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            this.update(json);
          })
          .catch((errorMessage) => {
            this.failed(errorMessage)
          });
      }
    }

    failed(errorMessage) {
      return errorMessage;
    }
  }

  return ApiActions;
}

export { createApiActions };
