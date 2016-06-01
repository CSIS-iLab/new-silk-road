import React, { Component, PropTypes } from 'react';
import OptionSelect from './OptionSelect';
import CountryStore from '../stores/CountryStore';
import CountryActions from '../actions/CountryActions';
import Option from '../models/Option';

class CountrySelectContainer extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onSelect: PropTypes.func
  }

  state = {
    countries: [],
    errorMessage: null
  }

  componentDidMount() {
    CountryStore.listen(this.onChange);
    CountryActions.fetchCountries();
  }

  onChange = (data) => {
    this.setState({
      countries: data.countries,
      errorMessage: data.errorMessage
    });
  }

  handleSelect = (value, event) => {
    if (this.props.onSelect) {
      this.props.onSelect(this.props.name, value);
    }
  }

  render() {
    let options = this.state.countries.map((country) => new Option(country.name, country.alpha_3));
    return (
      <OptionSelect handleSelect={this.handleSelect} name={this.props.name} options={options} />
    )
  }
}

export default CountrySelectContainer;
