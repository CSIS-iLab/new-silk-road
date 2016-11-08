import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import {Input} from './forms';
import Option from '../models/Option';

export default class DateRangeSelect extends Component {
  static propTypes = {
    dateLookupOptions: PropTypes.array.isRequired,
    labelName: PropTypes.string,
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
    const lookupMap = this.props.dateLookupOptions.map(function (obj) {
      let lObj = {};
      if (obj && obj.value) {
        lObj[obj.value] = null;
        lObj[`${obj.value}__gte`] = null;
        lObj[`${obj.value}__lte`] = null;
      }
      return lObj;
    });
    let q = Object.assign({}, ...lookupMap);
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
      labelName,
      boundLength,
    } = this.props;
    return (
      <div className='dateRangeSelect'>
        <Select
        value={dateLookupType}
        name='date_lookup_type'
        placeholder={labelName}
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
