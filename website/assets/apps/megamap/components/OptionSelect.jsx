import React, { PropTypes } from 'react';
import { Select } from './forms';

const OptionSelect = props => (
  <div>
    <label htmlFor={props.name}>
      {props.labelName}:
    </label>
    <Select
      onSelect={props.onSelect}
      name={props.name}
      value=""
      enabled={props.enabled}
    >
      <option value="">---------</option>
      {props.options.map((opt, i) => {
        const optKey = `${opt.name}-${i}`;
        return (
          <option key={optKey} value={opt.value}>{opt.name}</option>
        );
      })}
    </Select>
  </div>
);

OptionSelect.propTypes = {
  name: PropTypes.string.isRequired,
  labelName: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.instanceOf(Option)),
  enabled: PropTypes.bool,
};

OptionSelect.defaultProps = {
  options: [],
  enabled: true,
};


export default OptionSelect;
