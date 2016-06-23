import React, { Component, PropTypes } from 'react';
import Select from 'react-select';


function createSelectContainer(Store, Actions, selectName, labelName, mapOptions, fetchParams=null) {
  class SelectContainer extends Component {
    static propTypes = {
      onSelect: PropTypes.func
    }

    state = {
      isLoading: true,
      options: [],
      value: '',
      error: null
    }

    get selectName() { return selectName; }
    get labelName() { return labelName; }

    componentDidMount() {
      Store.listen(this.updateOptions);
      Actions.fetch(fetchParams);
    }

    updateOptions = (data) => {
      this.setState({
        options: mapOptions(data),
        error: data.error,
        isLoading: false
      });
    }

    onChange = (option, event) => {
      const value = option ? option.value : '';
      this.setState({value});
      if (this.props.onSelect) {
        this.props.onSelect({[this.selectName]: value});
      }
    }

    render() {
      const hasOptions = this.state.options.length > 0;
      return (
        <Select
          value={this.state.value}
          name={this.selectName}
          placeholder={this.labelName}
          options={this.state.options}
          onChange={this.onChange}
          isLoading={this.state.isLoading}
          />
      );
    }

  }

  return SelectContainer;
}

export { createSelectContainer };
