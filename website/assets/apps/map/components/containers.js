import React, { Component, PropTypes } from 'react';
import OptionSelect from './OptionSelect';


function createSelectContainer(Store, Actions, selectName, displayName, mapOptions) {
  class SelectContainer extends Component {
    static propTypes = {
      onSelect: PropTypes.func
    }

    state = {
      options: [],
      errorMessage: null
    }

    get selectName() { return selectName; }
    get displayName() { return displayName; }

    componentDidMount() {
      Store.listen(this.onChange);
      Actions.fetch();
    }

    onChange = (data) => {
      this.setState({
        options: mapOptions(data),
        errorMessage: data.errorMessage
      });
    }

    handleSelect = (value, event) => {
      if (this.props.onSelect) {
        this.props.onSelect(this.selectName, value);
      }
    }

    render() {
      return (
        <OptionSelect
          name={this.selectName}
          displayName={this.displayName}
          options={this.state.options}
          onSelect={this.handleSelect}
          />
      );
    }

  }

  return SelectContainer;
}

export { createSelectContainer };
