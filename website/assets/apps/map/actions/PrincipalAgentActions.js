import alt from '../alt';
import {OrganizationSource} from '../sources/apisources';

class PrincipalAgentActions {

  update(data) {
    return data.results;
  }

  fetch(query) {
    return (dispatch) => {
      dispatch();
      OrganizationSource.fetch(query)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.update(json);
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

PrincipalAgentActions = alt.createActions(PrincipalAgentActions);
export default PrincipalAgentActions;
