import React, { Component, PropTypes } from 'react';
import CountrySelect from './CountrySelect';
import CountryStore from '../stores/CountryStore';
import CountryActions from '../actions/CountryActions';

class CountrySelectContainer extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired
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

  render() {
    return (
      <CountrySelect name={this.props.name} countries={this.state.countries} />
    )
  }
}

export default CountrySelectContainer;
