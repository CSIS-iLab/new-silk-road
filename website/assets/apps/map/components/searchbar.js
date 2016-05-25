import React, { Component, PropTypes } from "react";
import Radium from "radium";
import { Input, Button } from "./forms";
import {labelStyle} from "./form-styles";

class SearchBar extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    label: PropTypes.string.isRequired
  };

  render() {
    return (
      <div className="searchbar">
        <label>
          <span style={labelStyle.base}>{this.props.label}</span>
          <Input type="search" name={this.props.name} placeholder={this.props.placeholder} />
        </label>
        <Button type='submit'>Search</Button>
      </div>
    )
  }
}
SearchBar = Radium(SearchBar);

export default SearchBar;
