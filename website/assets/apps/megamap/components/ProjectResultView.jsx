import React, { PropTypes } from 'react';

const ProjectResultView = (props) => {
  const {
    project,
  } = props;

  const listItems = project.initiatives.map((init) => {
    const url = init.page_url || null;
    return (
      <li key={init.name}>
        <a href={url} target="_blank" rel="noopener noreferrer">{init.name}</a>
      </li>
    );
  });

  return (
    <section className="projectResult">
      <h1>{project.name}</h1>
      <p><em>Type:</em> {project.infrastructure_type}</p>
      {
        listItems.length > 0 &&
          <section className="initiativesList">
            <h2>Initiatives:</h2>
            <ul>
              {listItems}
            </ul>
          </section>
      }
    </section>
  );
};

ProjectResultView.propTypes = {
  project: PropTypes.shape({
    name: PropTypes.string,
    infrastructure_type: PropTypes.string,
    initiatives: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      page_url: PropTypes.string,
    })),
  }).isRequired,
};

export default ProjectResultView;
