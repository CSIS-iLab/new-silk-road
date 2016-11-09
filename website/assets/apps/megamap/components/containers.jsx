import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

function createSelectContainer(Store, Actions, classOpts) {
  const {
    selectName,
    labelName,
    fetchParams,
    mapOptions,
    selectMultiple: selectMultipleOpt = false,
  } = classOpts;
  class SelectContainer extends Component {

    constructor(props) {
      super(props);
      this.state = {
        isLoading: true,
        options: [],
        value: '',
        error: null,
      };
      this.onChange = this.onChange.bind(this);
      this.updateOptions = this.updateOptions.bind(this);
    }

    componentDidMount() {
      Store.listen(this.updateOptions);
      Actions.fetch(fetchParams);
    }

    onChange(optionOrOptions) {
      let submitValue;
      if (Array.isArray(optionOrOptions)) {
        submitValue = optionOrOptions.map(x => x.value);
      } else {
        submitValue = optionOrOptions ? optionOrOptions.value : null;
      }
      this.setState({ value: optionOrOptions });
      if (this.props.onSelect) {
        this.props.onSelect({ [selectName]: submitValue });
      }
    }

    updateOptions(data) {
      this.setState({
        options: mapOptions(data),
        error: data.error,
        isLoading: false,
      });
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
          name={selectName}
          placeholder={labelName}
          options={options}
          onChange={this.onChange}
          isLoading={isLoading}
          multi={selectMultiple}
          clearable={!selectMultiple}
        />
      );
    }

  }

  SelectContainer.propTypes = {
    onSelect: PropTypes.func,
    selectMultiple: PropTypes.bool,
  };

  SelectContainer.defaultProps = {
    selectMultiple: selectMultipleOpt,
  };


  return SelectContainer;
}

const nameIdMapper = data => data.results.map(
  obj => Object.create({ label: obj.name, value: obj.id }),
);

export { createSelectContainer, nameIdMapper };
