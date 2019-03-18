import React, { PropTypes } from 'react';
import GeoStoreActions from '../actions/GeoStoreActions';

const ProjectResultView = (props) => {
  const {
    project,
  } = props;

  const listItems = project.initiatives.map((init) => {
    const url = init.page_url || null;
    return (
      <li key={init.name} className="projectResult__initiatives-list-item">
        <a href={url} target="_blank" rel="noopener noreferrer">{init.name}</a>
      </li>
    );
  });

  return (
    <section className="projectResult">
      <h3 className="projectResult__title">
        {project.name}
        { project.geo ?
          <div
            className="projectResult__pin-button"
            title="Locate on map"
            role="button"
            tabIndex="0"
            onClick={() => GeoStoreActions.selectGeoStoreId(project.geo)}
          /> :
          null
        }
      </h3>
      <section className="projectResult__section">
        <div className="projectResult__data-label">Type</div>
        <div>
          {project.infrastructure_type}
        </div>
      </section>
      {
        listItems.length > 0 &&
          <section className="projectResult__section projectResult__section--initiatives-list">
            <div className="projectResult__data-label">Initiatives</div>
            <ul className="projectResult__initiatives-list">
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
