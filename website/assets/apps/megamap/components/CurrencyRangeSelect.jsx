import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import CurrencyStore from '../stores/CurrencyStore';

export default class CurrencyRangeSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      options: [],
      lookups: {},
    };
    this.updateOptions = this.updateOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    CurrencyStore.listen(this.updateOptions);
  }

  updateOptions(data) {
    const options = Object.keys(data.lookups)
                          .map(key => ({ label: key, value: key }));
    const { lookups } = data;
    this.setState({ lookups, options });
  }

  handleChange(option) {
    let lookupObj = {};
    if (option) {
      const { value = '' } = option;
      lookupObj = this.state.lookups[value];
      this.setState({ selectValue: value });
    }
    const { onChange } = this.props;
    if (onChange) {
      this.props.onChange(lookupObj);
    }
  }

  render() {
    const value = !this.props.clear ? this.state.selectValue : '';
    return (
      <Select
        value={value}
        name={this.props.name}
        placeholder={this.props.placeholder}
        options={this.state.options}
        onChange={this.handleChange}
        isLoading={this.state.options.length === 0}
        backspaceToRemoveMessage=""
      />
    );
  }
}

CurrencyRangeSelect.propTypes = {
  name: PropTypes.string.isRequired,
  clear: PropTypes.bool,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};
