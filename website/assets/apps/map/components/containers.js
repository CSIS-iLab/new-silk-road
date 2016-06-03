import React, { Component, PropTypes } from 'react';
import OptionSelect from './OptionSelect';


function createSelectContainer(Store, Actions, selectName, labelName, mapOptions, fetchParams=null) {
  class SelectContainer extends Component {
    static propTypes = {
      onSelect: PropTypes.func
    }

    state = {
      options: [],
      errorMessage: null
    }

    get selectName() { return selectName; }
    get labelName() { return labelName; }

    componentDidMount() {
      Store.listen(this.onChange);
      Actions.fetch(fetchParams);
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
          labelName={this.labelName}
          options={this.state.options}
          onSelect={this.handleSelect}
          />
      );
    }

  }

  return SelectContainer;
}

export { createSelectContainer };
