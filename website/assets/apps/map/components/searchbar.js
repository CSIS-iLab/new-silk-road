import React, { Component, PropTypes } from "react";
import Radium from "radium";
import { Input, Button } from "./forms";

class SearchBar extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired
  };

  render() {
    let styles = {
      base: {

      }
    }
    return (
      <div className="searchbar">
        <Input type="search" name={this.props.name} placeholder={this.props.placeholder} />
        <Button type='submit'>Search</Button>
      </div>
    )
  }
}

module.exports = Radium(SearchBar)
