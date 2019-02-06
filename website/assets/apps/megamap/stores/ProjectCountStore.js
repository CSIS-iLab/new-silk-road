import alt from '../alt';
import ProjectCountActions from '../actions/ProjectCountActions';

class ProjectCountStoreBase {
  constructor() {
    this.total = 0;

    this.bindListeners({
      handleReceive: ProjectCountActions.RECEIVE,
      handleError: ProjectCountActions.FAILED,
    });
  }

  handleReceive(count) {
    this.total = count;
  }

  handleError() {
    this.total = 0;
  }
}

const ProjectCountStore = alt.createStore(ProjectCountStoreBase, 'ProjectCountStore');

export default ProjectCountStore;
