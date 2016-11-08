import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { Input, Button } from './forms';

class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
    };
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  handleUserInput(value) {
    const { name } = this.props;
    if (this.props.onSearchInput) {
      this.setState({ inputText: value });
      this.props.onSearchInput({ [name]: value.trim() });
    }
  }

  render() {
    return (
      <div className="searchBar" id={this.props.id}>
        {(this.props.label !== undefined && this.props.label !== '') &&
          <label htmlFor={this.props.name}>
            {this.props.label}:
          </label>
        }
        <Input
          inputText={this.state.inputText}
          onUserInput={this.handleUserInput}
          name={this.props.name}
          placeholder={this.props.placeholder}
        />
        {this.props.showSubmit &&
          <Button
            type="submit"
            title="Search"
            enabled={this.props.searchEnabled}
          >Search
          </Button>
        }
      </div>
    );
  }
}

SearchBar.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  searchEnabled: PropTypes.bool.isRequired,
  onSearchInput: PropTypes.func,
  showSubmit: PropTypes.bool,
};

SearchBar.defaultProps = {
  showSubmit: true,
};

export default Radium(SearchBar);
