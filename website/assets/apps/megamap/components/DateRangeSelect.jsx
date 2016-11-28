import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

class DateRangeSelect extends Component {

  constructor(props) {
    super(props);
    this.handleSelectUpdate = this.handleSelectUpdate.bind(this);
    this.handleInputUpdate = this.handleInputUpdate.bind(this);
  }

  handleSelectUpdate(option) {
    const obj = { dateLookupType: (option ? option.value : '') };
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, obj));
    }
  }

  handleInputUpdate(event) {
    const { target } = event;
    const obj = { [target.name]: target.value };
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, obj));
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
          value={value.dateLookupType || ''}
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
    dateLookupType: PropTypes.string,
    lowerValue: PropTypes.string,
    upperValue: PropTypes.string,
  }),
};

DateRangeSelect.defaultProps = {
  boundLength: 4,
  value: {
    dateLookupType: '',
    lowerValue: '',
    upperValue: '',
  },
};

export default DateRangeSelect;
