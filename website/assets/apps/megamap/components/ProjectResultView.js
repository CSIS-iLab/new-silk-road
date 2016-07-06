import React, { Component, PropTypes } from "react";

export default class ProjectResultView extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
  }


  render() {
    const {
      project
    } = this.props;

    return (
      <section className="projectResult" title={project.name}>
      <h1>{project.name}</h1>
      <p><em>Type:</em> {project.infrastructure_type}</p>

      {(() => {
        const listItems = project.initiatives.map((init) => {
          const url = init.page_url || null;
          return (
            <li key={init.name}>
            <a href={url} target="_blank">{init.name}</a>
            </li>
          );
        })
        if (listItems.length > 0) {
          return (
            <section className="initiativesList">
            <h2>Initiatives:</h2>
            <ul>
            {listItems}
            </ul>
            </section>
          );
        }
        return;
      })()}
      </section>
    );
  }
}
