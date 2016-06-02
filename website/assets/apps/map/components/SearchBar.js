import React, { Component, PropTypes } from "react";
import Radium, { Style } from "radium";
import { Input, Button } from "./forms";

class SearchBar extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    label: PropTypes.string.isRequired,
    inputText: PropTypes.string,
    onSearchInput: PropTypes.func
  };

  handleUserInput = (value, e) => {
    if (this.props.onSearchInput && value.trim() !== '') {
      this.props.onSearchInput(this.props.name, value.trim());
    }
  }

  render() {
    return (
      <div className="searchbar">
        <label for={this.props.name}>
        {this.props.label}:
        </label>
        <Input type="search"
        ref="searchTextInput"
        inputText={this.props.inputText}
        onUserInput={this.handleUserInput}
        name={this.props.name} placeholder={this.props.placeholder}
        />
        <Button type='submit' bordered={true}>Search</Button>
      </div>
    )
  }
}
SearchBar = Radium(SearchBar);

export default SearchBar;
