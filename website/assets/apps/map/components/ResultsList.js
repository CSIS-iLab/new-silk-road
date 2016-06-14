import React, { Component, PropTypes } from "react";
import {Button} from './forms';
import GeoStoreActions from '../actions/GeoStoreActions';

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
    // TODO: Event/Action on MapButton click
    console.log(`handleMapButtonClick: ${event.target.value}`);
    if (event.target.value) {
      GeoStoreActions.selectGeoStoreId(event.target.value);
    }
  }

  render() {
    return (
      <ul className="searchResults">
      {
        this.props.results.map((result, index) => {
          let geoid = result.geo && result.geo.id;
          return (
            <li key={index} className="result">
              <p>{result.name}</p>
              <p>Type: <strong>{result.infrastructure_type}</strong></p>
              <div className='buttonBar'>
                <Button type='button'
                  onClick={this.handleMapButtonClick}
                  value={geoid || ''}
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
