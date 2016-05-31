import React, { Component, PropTypes } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import CountrySelect from './CountrySelect';
import CountryStore from '../stores/CountryStore';
import CountryActions from '../actions/CountryActions';

class CountrySelectContainer extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired
  }

  static getStores() {
    return [CountryStore];
  }
  static getPropsFromStores() {
    return CountryStore.getState();
  }

  componentDidMount() {
    CountryActions.fetchCountries();
  }

  render() {
    return (
      <CountrySelect name={this.props.name} countries={this.props.countries} />
    )
  }
}

export default connectToStores(CountrySelectContainer);
