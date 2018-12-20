import React, { Component, PropTypes } from 'react';
import Radium, { Style } from 'radium';
import classNames from 'classnames';
import ResultsList from './ResultsList';
import SearchActions from '../actions/SearchActions';


const resultsNavStyle = {
  hidden: {
    display: 'none',
  },
};

const scrollWrap = {
  base: {
    overflowX: 'hidden',
    overflowY: 'scroll',
    '.scrollContent': {
      padding: '4px 3px',
    },
  },
  hidden: {
    display: 'none',
  },
};


class ResultsView extends Component {

  constructor(props) {
    super(props);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.searchForCuratedResults = this.searchForCuratedResults.bind(this);
  }

  componentWillUpdate() {
    this.scrollWrap.scrollTop = 0;
  }

  handleNextClick(e) {
    if (this.props.onNextClick) {
      this.props.onNextClick(e);
    }
  }

  handlePreviousClick(e) {
    if (this.props.onPreviousClick) {
      this.props.onPreviousClick(e);
    }
  }

  getPageNumbersFromURL(previousURL, nextURL, totalNumResults) {
    /* Return current page number & total number of pages based on previousURL and nextURL */
    let currentPage;
    let numPages;
    let keyAndValue;

    if (nextURL !== null) {
      // There is a nextURL, so use it to find the currentPage and numPages
      let numLastResult;
      let pageSize;
      const parameters = nextURL.slice(nextURL.indexOf('?') + 1).split('&');
      for (let i = 0; i < parameters.length; i++) {
        keyAndValue = parameters[i].split('=');
        const key = keyAndValue[0];
        const value = keyAndValue[1];
        if (key === 'offset') {
          numLastResult = parseInt(value);
        }
        if (key === 'limit') {
          pageSize = parseInt(value);
        }
      }
      currentPage = Math.ceil(numLastResult / pageSize);
      numPages = Math.ceil(totalNumResults / pageSize);
    } else if (previousURL !== null) {
      // There is no nextURL, but there is a previousURL, so this must be the last page
      let pageSize;
      const parameters = previousURL.slice(previousURL.indexOf('?') + 1).split('&');
      for (let i = 0; i < parameters.length; i++) {
        keyAndValue = parameters[i].split('=');
        const key = keyAndValue[0];
        const value = keyAndValue[1];
        if (key === 'limit') {
          pageSize = parseInt(value);
        }
      }
      numPages = Math.ceil(totalNumResults / pageSize);
      currentPage = numPages;
    } else {
      // There is no previousURL or nextURL. This must be page 1 of 1
      currentPage = 1;
      numPages = 1;
    }

    return [currentPage, numPages];
  }

  searchForCuratedResults (e) {
    /* Get the curated project collection query, update parent's state, and search the backend. */

    // Get the project collection query
    let query = {
      'curated_project_collections': [parseInt(e.target.id)],
      'infrastructure_type': [],
    }
    // Uopdate parent state for the curated_project_collections
    this.props.updateParentQuery(query);
    // Query the backend (which will also update the map)
    SearchActions.search(query);
  }

  render() {
    const noResults = this.props.results.length === 0;
    let currentPage;
    let numPages;

    if (!noResults) {
      const pageNumbers = this.getPageNumbersFromURL(
        this.props.previousURL, this.props.nextURL, this.props.totalCount
      );
      currentPage = pageNumbers[0];
      numPages = pageNumbers[1];
    }

    let curatedProjectCollectionsElements = [];
    if (this.props.curatedProjectCollections !== undefined && this.props.curatedProjectCollections.length > 0) {
      for (let i=0; i<this.props.curatedProjectCollections.length; i++) {
        curatedProjectCollectionsElements.push(
          <a id={this.props.curatedProjectCollections[i].__proto__.value}
             key={this.props.curatedProjectCollections[i].__proto__.value}
             onClick={this.searchForCuratedResults}
          >
            {this.props.curatedProjectCollections[i].__proto__.label}
          </a>
        );
      }
    }

    return (
      <div className="resultsView resultsView__main" style={this.props.style}>
        <h2
          className={classNames(
            'summaryInfo',
            'resultsView__summary-info',
            { 'resultsView__summary-info--with-results': this.props.results.length > 0 },
          )}
        >
          {this.props.totalCount} Projects
        </h2>
        <div
          className="scrollWrap"
          ref={(el) => { this.scrollWrap = el; }}
          style={[
            scrollWrap.base,
          ]}
        >
          <div className="scrollContent"
            style={[
              this.props.results.length === 0 && scrollWrap.hidden,
            ]}
          >
            <ResultsList results={this.props.results} />
          </div>
          <div
            className="scrollContent"
            style={[
              this.props.results.length !== 0 && scrollWrap.hidden,
            ]}
          >
            <section>
              <p className="resultsView__body-text">
                Click the icon panel on the right to hide the results of particular infrastructure types on the map.
              </p>
              <p className="resultsView__body-text">
                Search and filter results by clicking the “<b>Filter</b>” tab above.
              </p>
            </section>
          </div>
        </div>
        <div
          className="resultsView__pagination"
          style={[
            noResults && resultsNavStyle.hidden,
          ]}
        >
          <div
            className={classNames(
              'resultsView__pagination-buttonWrap',
              { 'resultsView__pagination-buttonWrap--disabled': this.props.previousURL == null },
            )}
          >
            <button
              className="resultsView__pagination-button--previous"
              disabled={this.props.previousURL == null}
              onClick={this.handlePreviousClick}
              value={this.props.previousURL}
            />
          </div>
          <div className="resultsView__pagination-count">
            Page {currentPage} of {numPages}
          </div>
          <div
            className={classNames(
              'resultsView__pagination-buttonWrap',
              { 'resultsView__pagination-buttonWrap--disabled': this.props.nextURL == null },
            )}
          >
            <button
              className="resultsView__pagination-button--next"
              disabled={this.props.nextURL == null}
              onClick={this.handleNextClick}
              value={this.props.nextURL}
            />
          </div>
        </div>
      </div>
    );
  }

}

ResultsView.propTypes = {
  style: PropTypes.objectOf(Style),
  results: PropTypes.arrayOf(PropTypes.object),
  previousURL: PropTypes.string,
  nextURL: PropTypes.string,
  onNextClick: PropTypes.func,
  onPreviousClick: PropTypes.func,
};

ResultsView.defaultProps = {
  style: {},
  previousURL: null,
  nextURL: null,
  onNextClick: null,
  onPreviousClick: null,
};

export default Radium(ResultsView);
