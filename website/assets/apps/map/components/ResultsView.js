import React, { Component, PropTypes } from "react";
import Radium, { Style } from "radium";
import ResultsList from './ResultsList';
import {Button} from './forms';


const resultsNavStyle = {
  base: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  hidden: {
    display: 'none'
  }
}

const resultsViewStyle = {
  maxHeight: '100%',
  overflow: 'hidden',
  flex: '1 1 auto',
  order: 0,
  '.resultsNav button': {
    width: 80,
    display: 'block',
    flex: '0.475 0 auto',
    order: 0
  },
  '.scrollWrap': {
    maxHeight: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  '.scrollContent': {
    padding: '4px 3px'
  }
}


class ResultsView extends Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
    previousURL: PropTypes.string,
    nextURL: PropTypes.string,
    onNextClick: PropTypes.func,
    onPreviousClick: PropTypes.func
  }
  static defaultProps = {
    previousURL: null,
    nextURL: null,
    onNextClick: null,
    onPreviousClick: null
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
    return (
      <div className="resultsView">
        <div className="resultsNav" style={[
          resultsNavStyle.base,
          this.props.results.length === 0 && resultsNavStyle.hidden
        ]}>
          <Button
            enabled={this.props.previousURL !== null}
            onClick={this.handlePreviousClick}
            value={this.props.previousURL}
          >Previous</Button>
          <Button
            enabled={this.props.nextURL !== null}
            onClick={this.handleNextClick}
            value={this.props.nextURL}
          >Next</Button>
        </div>
        <div className="scrollWrap">
          <div className="scrollContent">
            <ResultsList results={this.props.results} />
          </div>
        </div>
        <Style
          scopeSelector=".resultsView"
          rules={resultsViewStyle}
        />
      </div>
    );
  }

}

ResultsView = Radium(ResultsView);
export default ResultsView;
