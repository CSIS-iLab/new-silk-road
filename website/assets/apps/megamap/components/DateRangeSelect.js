import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import {Input} from './forms';
import Option from '../models/Option';

export default class DateRangeSelect extends Component {
  static propTypes = {
    dateLookupOptions: PropTypes.array.isRequired,
    lowerBoundLabel: PropTypes.string.isRequired,
    upperBoundLabel: PropTypes.string.isRequired,
    boundLength: PropTypes.number,
    onSelect: PropTypes.func,
  }

  static defaultProps = {
    boundLength: 4,
  }

  state = {
    dateLookupType: null,
    lowerValue: '',
    upperValue: '',
  }

  componentDidUpdate(_, prevState) {
    const importantState = [
      'dateLookupType',
      'lowerValue',
      'upperValue',
    ];
    for (let prop of importantState) {
      if (this.state.hasOwnProperty(prop) &&
          prevState.hasOwnProperty(prop) &&
          prevState[prop] !== this.state[prop]
        ) {
          this.triggerSelectHandler();
          break;
      }
    }
  }

  onLookupChange = (option, event) => {
    const value = option ? option.value : '';
    this.setState({dateLookupType: value});
  }

  handleLowerInput = (value, event) => {
    this.setState({lowerValue: value});
  }

  handleUpperInput = (value, event) => {
    this.setState({upperValue: value});
  }

  triggerSelectHandler() {
    const {onSelect} = this.props;
    if (onSelect) {
      const q = this._getCalculatedQuery();
      onSelect(q);
    }
  }

  _getCalculatedQuery() {
    const {
      dateLookupType,
      lowerValue,
      upperValue,
    } = this.state;
    let q = {};
    for (let option of this.props.dateLookupOptions) {
      const lookupType = option ? option.value : '';
      q[`${lookupType}__gte`] = lookupType === dateLookupType ? lowerValue : null;
      q[`${lookupType}__lt`] = lookupType === dateLookupType ? upperValue : null;
    }
    return q;
  }

  render() {
    const {
      dateLookupType,
      lowerValue,
      upperValue
    } = this.state;
    const {
      dateLookupOptions,
      lowerBoundLabel,
      upperBoundLabel,
      boundLength
    } = this.props;
    return (
      <div className='dateRangeSelect'>
        <Select
        value={dateLookupType}
        name='date_lookup_type'
        placeholder={this.labelName}
        options={dateLookupOptions}
        onChange={this.onLookupChange}
        />
        <span>between</span>
        <Input
        inputText={lowerValue}
        name='lowerValue'
        size={boundLength}
        placeholder={lowerBoundLabel}
        onUserInput={this.handleLowerInput.bind(this)}
        />
        <span>&amp;</span>
        <Input
        inputText={upperValue}
        name='upperValue'
        size={boundLength}
        placeholder={upperBoundLabel}
        onUserInput={this.handleUpperInput.bind(this)}
        />
      </div>
    );
  }
}
