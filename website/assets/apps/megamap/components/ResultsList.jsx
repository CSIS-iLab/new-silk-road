import React, { Component, PropTypes } from 'react';
import GeoStoreActions from '../actions/GeoStoreActions';
import ProjectResultView from './ProjectResultView';

class ResultsList extends Component {

  static handleDetailClick(event) {
    if (event.target.value) {
      window.open(event.target.value, '_blank');
    }
  }

  render() {
    return (
      <ul className="searchResults">
        {
          this.props.results.map((result, index) => (
            <li key={index} className="searchResults__result">
              <ProjectResultView key={result.identifier} project={result} />
              <div className="searchResults__buttonBar">
                <button
                  type="button"
                  className="searchResults__button"
                  onClick={ResultsList.handleDetailClick}
                  value={result.page_url}
                >
                  Open Project
                </button>
              </div>
            </li>
          ))
        }
      </ul>
    );
  }
}

ResultsList.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape({
    identifier: PropTypes.string,
    geo: PropTypes.string,
    page_url: PropTypes.string,
  })).isRequired,
};

export default ResultsList;
