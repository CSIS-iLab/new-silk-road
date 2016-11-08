import React, { Component, PropTypes } from 'react';
import CurrencyStore from '../stores/CurrencyStore';
import CurrencyActions from '../actions/CurrencyActions';
import Select from 'react-select';
import Option from '../models/Option';

export default class CurrencyAmountSelectContainer extends Component {
  static propTypes = {
    onSelect: PropTypes.func
  }

  state = {
    isLoading: true,
    options: [],
    value: '',
    lookups: {},
    error: null
  }

  get labelName() { return 'Cost'; }

  componentDidMount() {
    CurrencyStore.listen(this.updateOptions);
    CurrencyActions.fetch();
  }

  updateOptions = (data) => {
    this.setState({
      lookups: data.lookups,
      options: Object.keys(data.lookups).map((key) => new Option(key, key)),
      error: data.error,
      isLoading: false
    });
  }

  onChange = (option, event) => {
    const value = option ? option.value : '';
    this.setState({value});
    if (this.props.onSelect) {
      this.props.onSelect(this.state.lookups[value]);
    }
  }

  render() {
    const hasOptions = this.state.options.length > 0;
    return (
      <Select
        value={this.state.value}
        name='cost'
        placeholder={this.labelName}
        options={this.state.options}
        onChange={this.onChange}
        isLoading={this.state.isLoading}
        />
    );
  }

}
