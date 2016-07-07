import React, { Component, PropTypes } from 'react';
import Select from 'react-select';


function createSelectContainer(Store, Actions, options) {
  const {
    selectName,
    labelName,
    fetchParams,
    mapOptions,
    selectMultiple = false,
    delimiter = '|',
  } = options;
  class SelectContainer extends Component {
    static propTypes = {
      onSelect: PropTypes.func,
      selectMultiple: PropTypes.bool,
      delimiter: PropTypes.string,
    }

    static defaultProps = {
      selectMultiple: selectMultiple,
      delimiter: delimiter,
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

    onChange = (optionOrOptions, event) => {
      let submitValue;
      if (Array.isArray(optionOrOptions)) {
        submitValue = optionOrOptions.map( (x) => x.value).join(this.props.delimiter);
      } else {
        submitValue = optionOrOptions ? optionOrOptions.value : null;
      }
      this.setState({value: optionOrOptions});
      if (this.props.onSelect) {
        this.props.onSelect({[this.selectName]: submitValue});
      }
    }

    render() {
      const {
        options,
        isLoading,
        value,
      } = this.state;
      const {
        selectMultiple,
      } = this.props;
      return (
        <Select
          value={value}
          name={this.selectName}
          placeholder={this.labelName}
          options={options}
          onChange={this.onChange}
          isLoading={isLoading}
          multi={selectMultiple}
          clearable={!selectMultiple}
          />
      );
    }

  }

  return SelectContainer;
}

export { createSelectContainer };
