import React, { Component, PropTypes } from 'react';
import {Select} from './forms';
import Option from '../models/Option';

export default class OptionSelect extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    handleSelect: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.instanceOf(Option))
  }
  static defaultProps = {
    options: []
  }

  render() {
    var {
      name,
      displayName,
      options
    } = this.props;
    return (
      <div>
        <label for={ name }>
        {displayName}:
        </label>
        <Select onSelect={this.props.handleSelect} name={ name } value="">
        <option value="">---------</option>
        {options.map((opt, i) => {
          let optKey = `${opt.name}-${i}`;
          return (
            <option key={optKey} value={opt.value}>{opt.name}</option>
          );
        })}
        </Select>
      </div>
    );
  }
}
