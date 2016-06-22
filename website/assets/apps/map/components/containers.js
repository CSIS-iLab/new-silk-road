import React, { Component, PropTypes } from 'react';
import Select from 'react-select';


function createSelectContainer(Store, Actions, selectName, labelName, mapOptions, fetchParams=null) {
  class SelectContainer extends Component {
    static propTypes = {
      onSelect: PropTypes.func
    }

    state = {
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
        error: data.error
      });
    }

    onChange = (option, event) => {
      console.log(option);
      const value = option ? option.value : '';
      this.setState({value: value});
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
          labelName={this.labelName}
          options={this.state.options}
          onChange={this.onChange}
          />
      );
    }

  }

  return SelectContainer;
}

export { createSelectContainer };
