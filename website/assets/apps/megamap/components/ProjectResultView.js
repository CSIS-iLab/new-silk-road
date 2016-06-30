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
      <section className="projectResult">
      <p>{project.name}</p>
      <p>Type: <strong>{project.infrastructure_type}</strong></p>

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
            <p>Initiatives:</p>
            <ul className="clean">
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
