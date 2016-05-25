import React, { Component, PropTypes } from "react";
import Radium from "radium";
import { Input, Button } from "./forms";

class SearchBar extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    label: PropTypes.string.isRequired
  };

  render() {
    let styles = {
      label: {
        paddingRight: 6
      }
    }
    return (
      <div className="searchbar">
        <label>
          <span style={styles.label}>{this.props.label}</span>
          <Input type="search" name={this.props.name} placeholder={this.props.placeholder} />
        </label>
        <Button type='submit'>Search</Button>
      </div>
    )
  }
}
SearchBar = Radium(SearchBar)

export { SearchBar };
