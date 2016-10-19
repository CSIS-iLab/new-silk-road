import React, { Component, PropTypes } from "react";
import Radium, { Style } from "radium";
import ResultsList from './ResultsList';
import {Button} from './forms';


const resultsNavStyle = {
  hidden: {
    display: 'none'
  }
}

const scrollWrap = {
  base: {
    overflowX: 'hidden',
    overflowY: 'scroll',
    '.scrollContent': {
      padding: '4px 3px'
    }
  },
  hidden: {
    display: 'none'
  }
}


class ResultsView extends Component {
  static propTypes = {
    style: PropTypes.object,
    results: PropTypes.array.isRequired,
    previousURL: PropTypes.string,
    nextURL: PropTypes.string,
    onNextClick: PropTypes.func,
    onPreviousClick: PropTypes.func
  }
  static defaultProps = {
    style: {},
    previousURL: null,
    nextURL: null,
    onNextClick: null,
    onPreviousClick: null
  }

  componentWillUpdate() {
    this.refs.scrollWrap.scrollTop = 0;
  }

  handleNextClick = (e) => {
    if (this.props.onNextClick) {
      this.props.onNextClick(e);
    }
  }

  handlePreviousClick = (e) => {
    if (this.props.onPreviousClick) {
      this.props.onPreviousClick(e);
    }
  }

  render() {
    const noResults = this.props.results.length === 0;
    return (
      <div className="resultsView" style={this.props.style}>
        <div className="resultsNav" style={[
          noResults && resultsNavStyle.hidden
        ]}>
          <div className="buttonWrap">
            <Button
            enabled={this.props.previousURL !== null}
            onClick={this.handlePreviousClick}
            value={this.props.previousURL}
            >Previous</Button>
          </div>
          <div className="buttonWrap">
            <Button
            enabled={this.props.nextURL !== null}
            onClick={this.handleNextClick}
            value={this.props.nextURL}
            >Next</Button>
          </div>
        </div>
        <div className="scrollWrap" ref="scrollWrap"
        style={[
          scrollWrap.base,
          this.props.results.length === 0 && scrollWrap.hidden
        ]}>
          <div className="scrollContent">
            <ResultsList results={this.props.results} />
          </div>
        </div>
      </div>
    );
  }

}

ResultsView = Radium(ResultsView);
export default ResultsView;
