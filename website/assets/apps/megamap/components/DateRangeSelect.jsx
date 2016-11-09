import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

class DateRangeSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dateLookupType: null,
      lowerValue: '',
      upperValue: '',
    };
    this.onLookupChange = this.onLookupChange.bind(this);
    this.handleLowerInput = this.handleLowerInput.bind(this);
    this.handleUpperInput = this.handleUpperInput.bind(this);
  }

  componentDidUpdate(_, prevState) {
    const importantState = [
      'dateLookupType',
      'lowerValue',
      'upperValue',
    ];
    const stateIsUpdated = importantState.some(element =>
      ({}.hasOwnProperty.call(this.state, element) &&
      {}.hasOwnProperty.call(prevState, element) &&
      prevState[element] !== this.state[element]),
    );
    if (stateIsUpdated) {
      this.triggerSelectHandler();
    }
  }

  onLookupChange(option) {
    const value = option ? option.value : '';
    this.setState({ dateLookupType: value });
  }

  getCalculatedQuery() {
    // TODO: Test this function and refactor as needed
    const {
      dateLookupType,
      lowerValue,
      upperValue,
    } = this.state;
    const lookupMap = this.props.dateLookupOptions.map((obj) => {
      const lObj = {};
      if (obj && obj.value) {
        lObj[obj.value] = null;
        lObj[`${obj.value}__gte`] = null;
        lObj[`${obj.value}__lte`] = null;
      }
      return lObj;
    });
    const q = Object.assign({}, ...lookupMap);
    // See if our input can update q
    if (dateLookupType) {
      const lowerNum = +lowerValue || null;
      const upperNum = +upperValue || null;
      if (lowerNum || upperNum) {
        if (lowerNum === upperNum) {
          q[dateLookupType] = lowerNum;
        } else {
          q[`${dateLookupType}__gte`] = lowerNum;
          q[`${dateLookupType}__lte`] = upperNum;
        }
      }
    }
    return q;
  }

  triggerSelectHandler() {
    const { onSelect } = this.props;
    if (onSelect) {
      const q = this.getCalculatedQuery();
      onSelect(q);
    }
  }

  handleLowerInput(event) {
    this.setState({ lowerValue: event.target.value });
  }

  handleUpperInput(event) {
    this.setState({ upperValue: event.target.value });
  }

  render() {
    const {
      dateLookupOptions,
      lowerBoundLabel,
      upperBoundLabel,
      labelName,
      boundLength,
    } = this.props;
    return (
      <div className="dateRangeSelect">
        <Select
          value={this.state.dateLookupType}
          name="date_lookup_type"
          placeholder={labelName}
          options={dateLookupOptions}
          onChange={this.onLookupChange}
        />
        <span>between</span>
        <input
          value={this.state.lowerValue}
          name="lowerValue"
          size={boundLength}
          placeholder={lowerBoundLabel}
          onChange={this.handleLowerInput}
        />
        <span>&amp;</span>
        <input
          value={this.state.upperValue}
          name="upperValue"
          size={boundLength}
          placeholder={upperBoundLabel}
          onChange={this.handleUpperInput}
        />
      </div>
    );
  }
}

DateRangeSelect.propTypes = {
  dateLookupOptions: React.PropTypes.arrayOf(React.PropTypes.shape({
    label: React.PropTypes.string,
    value: React.PropTypes.string,
  })),
  labelName: PropTypes.string,
  lowerBoundLabel: PropTypes.string.isRequired,
  upperBoundLabel: PropTypes.string.isRequired,
  boundLength: PropTypes.number,
  onSelect: PropTypes.func,
};

DateRangeSelect.defaultProps = {
  boundLength: 4,
};

export default DateRangeSelect;
