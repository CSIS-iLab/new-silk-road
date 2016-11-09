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
            >Previous</button>
          </div>
          <div className="buttonWrap">
            <button
              disabled={this.props.nextURL == null}
              onClick={this.handleNextClick}
              value={this.props.nextURL}
            >Next</button>
          </div>
        </div>
        <div
          className="scrollWrap"
          ref={(el) => { this.scrollWrap = el; }}
          style={[
            scrollWrap.base,
            this.props.results.length === 0 && scrollWrap.hidden,
          ]}
        >
          <div className="scrollContent">
            <ResultsList results={this.props.results} />
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
