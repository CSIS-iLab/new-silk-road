import React, { Component, PropTypes } from "react";
import Radium, { Style } from "radium";
import { Input, Button } from "./forms";

class SearchBar extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    label: PropTypes.string.isRequired,
    searchEnabled: PropTypes.bool.isRequired,
    inputText: PropTypes.string,
    onSearchInput: PropTypes.func
  };

  handleUserInput = (value, e) => {
    if (this.props.onSearchInput) {
      this.props.onSearchInput({ [this.props.name]: value.trim() });
    }
  }

  render() {
    return (
      <div className="searchBar">
        <label for={this.props.name}>
        {this.props.label}:
        </label>
        <Input
        ref="searchTextInput"
        inputText={this.props.inputText}
        onUserInput={this.handleUserInput}
        name={this.props.name} placeholder={this.props.placeholder}
        />
        <Button type='submit'
                bordered={true}
                enabled={this.props.searchEnabled}
        >Search</Button>
      </div>
    )
  }
}
SearchBar = Radium(SearchBar);

export default SearchBar;
