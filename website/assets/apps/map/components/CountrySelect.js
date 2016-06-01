import React, { Component, PropTypes } from 'react';
import {Select} from './forms';


export default class CountrySelect extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    countries: PropTypes.arrayOf(PropTypes.object)
  }
  static defaultProps = {
    countries: []
  }

  render() {
    var {
      name,
      countries
    } = this.props;
    return (
      <div>
        <label for={ name }>
        Country:
        </label>
        <Select name={ name } value="">
        <option value="">---------</option>
        {countries.map((country, i) => {
          return (
            <option key={country.value} value={country.value}>{country.name}</option>
          );
        })}
        </Select>
      </div>
    );
  }
}
