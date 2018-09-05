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

  render() {
    const noResults = this.props.results.length === 0;
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
            Page 1 of 9
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
