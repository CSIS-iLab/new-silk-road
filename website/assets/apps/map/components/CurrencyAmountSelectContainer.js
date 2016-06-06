import React, { Component, PropTypes } from 'react';
import CurrencyStore from '../stores/CurrencyStore';
import CurrencyActions from '../actions/CurrencyActions';
import OptionSelect from './OptionSelect';
import Option from '../models/Option';

export default class CurrencyAmountSelectContainer extends Component {
  static propTypes = {
    onSelect: PropTypes.func
  }

  state = {
    options: [],
    lookups: {},
    errorMessage: null
  }

  get labelName() { return 'Cost'; }

  componentDidMount() {
    CurrencyStore.listen(this.onChange);
    CurrencyActions.fetch();
  }

  onChange = (data) => {
    this.setState({
      lookups: data.lookups,
      options: Object.keys(data.lookups).map((key) => new Option(key, key)),
      errorMessage: data.errorMessage
    });
  }

  handleSelect = (value, event) => {
    if (this.props.onSelect) {
      this.props.onSelect(this.state.lookups[value]);
    }
  }

  render() {
    const hasOptions = this.state.options.length > 0;
    return (
      <OptionSelect
        name='cost'
        labelName={this.labelName}
        options={this.state.options}
        onSelect={this.handleSelect}
        enabled={hasOptions}
        />
    );
  }

}
