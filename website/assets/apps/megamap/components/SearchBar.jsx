import React, { Component, PropTypes } from "react";
import Radium, { Style } from "radium";
import { Input, Button } from "./forms";

class SearchBar extends Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    searchEnabled: PropTypes.bool.isRequired,
    onSearchInput: PropTypes.func,
    showSubmit: PropTypes.bool
  };

  static defaultProps = {
    showSubmit: true
  }

  state = {
    inputText: '',

  }

  handleUserInput = (value, e) => {
    const {name} = this.props;
    if (this.props.onSearchInput) {
      this.setState({inputText: value});
      this.props.onSearchInput({ [name]: value.trim() });
    }
  }

  render() {
    return (
      <div className="searchBar" id={this.props.id}>
        {(() => {
          if (this.props.label) {
            console.log('label');
            return (
              <label for={this.props.name}>
              {this.props.label}:
              </label>
            );
          }
        })()}
        <Input
        ref="searchTextInput"
        inputText={this.state.inputText}
        onUserInput={this.handleUserInput.bind(this)}
        name={this.props.name} placeholder={this.props.placeholder}
        />
        {(()=> {
          if (this.props.showSubmit) {
            return (
              <Button type='submit'
              title='Search'
              enabled={this.props.searchEnabled}
              >Search</Button>
            );
          }
        })()}
      </div>
    )
  }
}
SearchBar = Radium(SearchBar);

export default SearchBar;
