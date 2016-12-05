/* eslint-disable class-methods-use-this */

function createApiActions(Source) {
  class ApiActions {
    update(x) {
      return x;
    }

    fetch(params) {
      return (dispatch) => {
        dispatch();
        Source.fetch(params)
          .then(response => response.json())
          .then((json) => {
            this.update(json);
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

  return ApiActions;
}

export default createApiActions;
