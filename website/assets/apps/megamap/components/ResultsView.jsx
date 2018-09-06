import React, { Component, PropTypes } from 'react';
import Radium, { Style } from 'radium';
import ResultsList from './ResultsList';



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
      const parameters = this.props.nextURL.slice(this.props.nextURL.indexOf('?') + 1).split('&');
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
      const parameters = this.props.previousURL.slice(this.props.previousURL.indexOf('?') + 1).split('&');
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

    return (
      <div className="resultsView" style={this.props.style}>
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
          <div className="scrollContent"
            style={[
              this.props.results.length !== 0 && scrollWrap.hidden,
            ]}
          >
            <section>
              <p>
                Click the icon panel on the right to hide the results of particular infrastructure types on the map.
              </p>
              <p>
                Search and filter results by clicking the “Filter” tab above.
              </p>
            </section>
            <section>
              <h2>Curated Results</h2>
              <p>
                This list of results illustrate some of the projects and strategies our team is following.
                <a>Projects funded by the World Bank</a>
                <a>Projects in India that were announced in 2018</a>
              </p>
            </section>
          </div>
        </div>
        <div
          className="resultsNav"
          style={[
            noResults && resultsNavStyle.hidden,
          ]}
        >
          <div className="buttonWrap">
            <button
              disabled={this.props.previousURL == null}
              onClick={this.handlePreviousClick}
              value={this.props.previousURL}
            ></button>
          </div>
          <div className="pagination">
            Page {currentPage} of {numPages}
          </div>
          <div className="buttonWrap">
            <button
              disabled={this.props.nextURL == null}
              onClick={this.handleNextClick}
              value={this.props.nextURL}
            ></button>
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
