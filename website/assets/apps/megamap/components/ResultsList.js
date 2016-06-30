import React, { Component, PropTypes } from "react";
import {Button} from './forms';
import GeoStoreActions from '../actions/GeoStoreActions';
import ProjectResultView from './ProjectResultView';

export default class ResultsList extends Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
  }

  handleDetailClick = (event) => {
    if (event.target.value) {
      window.open(event.target.value, '_blank');
    }
  }

  handleMapButtonClick = (event) => {
    if (event.target.value) {
      GeoStoreActions.selectGeoStoreId(event.target.value);
    }
  }

  render() {
    return (
      <ul className="searchResults">
      {
        this.props.results.map((result, index) => {
          let geoid = result.geo;
          return (
            <li key={index} className="result">
              <ProjectResultView key={result.identifier} project={result} />
              <div className='buttonBar'>
                <Button type='button'
                  onClick={this.handleMapButtonClick}
                  value={geoid}
                  enabled={geoid !== null}
                >View on Map</Button>
                <Button type='button'
                  onClick={this.handleDetailClick}
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
