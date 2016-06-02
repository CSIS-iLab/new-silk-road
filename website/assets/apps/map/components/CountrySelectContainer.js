import React, { Component, PropTypes } from 'react';
import OptionSelect from './OptionSelect';
import CountryStore from '../stores/CountryStore';
import CountryActions from '../actions/CountryActions';
import Option from '../models/Option';

class CountrySelectContainer extends Component {
  static propTypes = {
    onSelect: PropTypes.func
  }

  state = {
    options: [],
    errorMessage: null
  }

  get selectName() { return 'funding__sources__countries__code'; }
  get displayName() { return 'Countries'; }

  componentDidMount() {
    CountryStore.listen(this.onChange);
    CountryActions.fetchCountries();
  }

  onChange = (data) => {
    let options = data.countries.map((opt) => new Option(opt.name, opt.alpha_3));
    this.setState({
      options: options,
      errorMessage: data.errorMessage
    });
  }

  handleSelect = (value, event) => {
    if (this.props.onSelect) {
      this.props.onSelect(this.selectName, value);
    }
  }

  render() {
    return (
      <OptionSelect
        onSelect={this.handleSelect}
        name={this.selectName}
        displayName={this.displayName}
        options={this.state.options} />
    )
  }
}

export default CountrySelectContainer;
