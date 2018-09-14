import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

const defaultValue = () => ({ dateLookupType: '', lowerValue: '', upperValue: '' });

const validValue = (obj) => {
  if ({}.hasOwnProperty.call(obj, 'dateLookupType') && obj.dateLookupType !== '') {
    return obj;
  }
  return defaultValue();
};

class DateRangeSelect extends Component {

  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUpdate(updateObj) {
    const hasTarget = updateObj && {}.hasOwnProperty.call(updateObj, 'target');
    const obj = Object.assign({}, this.props.value);
    if (hasTarget) {
      Object.assign(obj, { [updateObj.target.name]: updateObj.target.value });
    } else {
      Object.assign(obj, { dateLookupType: (updateObj ? updateObj.value : '') });
    }
    const { onChange } = this.props;
    if (onChange) {
      onChange(validValue(obj));
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
          onChange={this.handleUpdate}
        />
        <span>between</span>
        <input
          value={value.lowerValue || ''}
          name="lowerValue"
          size={boundLength}
          placeholder={lowerBoundLabel}
          onChange={this.handleUpdate}
        />
        <span>and</span>
        <input
          value={value.upperValue || ''}
          name="upperValue"
          size={boundLength}
          placeholder={upperBoundLabel}
          onChange={this.handleUpdate}
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
  value: defaultValue(),
};

export default DateRangeSelect;
