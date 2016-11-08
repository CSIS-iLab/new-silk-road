import React, { Component, PropTypes } from 'react';
import { Button } from './forms';
import GeoStoreActions from '../actions/GeoStoreActions';
import ProjectResultView from './ProjectResultView';

class ResultsList extends Component {

  static handleDetailClick(event) {
    if (event.target.value) {
      window.open(event.target.value, '_blank');
    }
  }

  static handleMapButtonClick(event) {
    if (event.target.value) {
      GeoStoreActions.selectGeoStoreId(event.target.value);
    }
  }

  render() {
    return (
      <ul className="searchResults">
        {
          this.props.results.map((result, index) => {
            const geoid = result.geo;
            return (
              <li key={index} className="result">
                <ProjectResultView key={result.identifier} project={result} />
                <div className="buttonBar">
                  <Button
                    type="button"
                    onClick={(e) => { ResultsList.handleMapButtonClick(e); }}
                    value={geoid}
                    enabled={geoid !== null}
                  >View on Map</Button>
                  <Button
                    type="button"
                    onClick={(e) => { ResultsList.handleDetailClick(e); }}
                    value={result.page_url}
                  >Open detail page</Button>
                </div>
              </li>
            );
          })
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
