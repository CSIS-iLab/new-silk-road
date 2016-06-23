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
      .catch((error) => {
        this.failed(error);
      })
    }
  }

  failed(error) {
    return error;
  }
}

PrincipalAgentActions = alt.createActions(PrincipalAgentActions);
export default PrincipalAgentActions;
