import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

class DateRangeSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dateLookupType: '',
      lowerValue: '',
      upperValue: '',
    };
    this.handleSelectUpdate = this.handleSelectUpdate.bind(this);
    this.handleInputUpdate = this.handleInputUpdate.bind(this);
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

  handleSelectUpdate(option) {
    const obj = { dateLookupType: (option ? option.value : '') };
    this.setState(obj);
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, obj));
    }
  }

  handleInputUpdate(event) {
    const { target } = event;
    const obj = { [target.name]: target.value };
    this.setState(obj);
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, obj));
    }
  }

  render() {
    const {
      dateLookupOptions,
      lowerBoundLabel,
      upperBoundLabel,
      labelName,
      boundLength,
      value,
    } = this.props;
    return (
      <div className="dateRangeSelect">
        <Select
          value={value.dateLookupType}
          name="dateLookupType"
          placeholder={labelName}
          options={dateLookupOptions}
          onChange={this.handleSelectUpdate}
        />
        <span>between</span>
        <input
          value={value.lowerValue || ''}
          name="lowerValue"
          size={boundLength}
          placeholder={lowerBoundLabel}
          onChange={this.handleInputUpdate}
        />
        <span>&amp;</span>
        <input
          value={value.upperValue || ''}
          name="upperValue"
          size={boundLength}
          placeholder={upperBoundLabel}
          onChange={this.handleInputUpdate}
        />
      </div>
    );
  }
}

DateRangeSelect.propTypes = {
  dateLookupOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  labelName: PropTypes.string,
  lowerBoundLabel: PropTypes.string.isRequired,
  upperBoundLabel: PropTypes.string.isRequired,
  boundLength: PropTypes.number,
  onChange: PropTypes.func,
  value: PropTypes.shape({
    dateLookupType: PropTypes.string.isRequired,
    lowerValue: PropTypes.string,
    upperValue: PropTypes.string,
  }),
};

DateRangeSelect.defaultProps = {
  boundLength: 4,
  value: {
    dateLookupType: '',
    lowerValue: null,
    upperValue: null,
  },
};

export default DateRangeSelect;
