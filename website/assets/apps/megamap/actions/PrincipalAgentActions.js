/* eslint-disable class-methods-use-this */

import alt from '../alt';
import { OrganizationSource } from '../sources/apisources';

class PrincipalAgentActionsBase {

  update(data) {
    return data.results;
  }

  fetch(query) {
    return (dispatch) => {
      dispatch();
      OrganizationSource.fetch(query)
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

const PrincipalAgentActions = alt.createActions(PrincipalAgentActionsBase);
export default PrincipalAgentActions;
