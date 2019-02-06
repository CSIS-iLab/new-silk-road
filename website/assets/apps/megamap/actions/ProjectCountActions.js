import 'whatwg-fetch';
import alt from '../alt';
import { SearchSource } from '../sources/apisources';

class ProjectCountActionsBase {
  fetch() {
    return (dispatch) => {
      dispatch();
      SearchSource.fetch()
        .then(response => response.json())
        .then(this.receive)
        .catch((error) => {
          this.failed(error);
        });
    };
  }

  receive({ count }) {
    return count;
  }

  failed({ error }) {
    return error;
  }
}

const ProjectCountActions = alt.createActions(ProjectCountActionsBase);
export default ProjectCountActions;
