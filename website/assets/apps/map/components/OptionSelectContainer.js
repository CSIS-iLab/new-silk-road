import React, { Component, PropTypes } from 'react';
import OptionSelect from './OptionSelect';
import Option from '../models/Option';

class OptionSelectContainer extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    onSelect: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.instanceOf(Option))
  }

  handleSelect = (value, event) => {
    if (this.props.onSelect) {
      this.props.onSelect(this.props.name, value);
    }
  }

  render() {
    return (
      <OptionSelect
        handleSelect={this.handleSelect}
        name={this.props.name}
        displayName={this.props.displayName}
        options={this.props.options}
      />
    )
  }
}

export default OptionSelectContainer;
