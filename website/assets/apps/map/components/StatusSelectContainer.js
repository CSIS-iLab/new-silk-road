import React, { Component, PropTypes } from 'react';
import Option from '../models/Option';
import OptionSelect from './OptionSelect';
import StatusStore from '../stores/StatusStore';
import StatusActions from '../actions/StatusActions';

class StatusSelectContainer extends Component {
  static propTypes = {
    onSelect: PropTypes.func
  }

  state = {
    options: [],
    errorMessage: null
  }

  get selectName() { return 'status'; }
  get displayName() { return 'Status'; }

  componentDidMount() {
    StatusStore.listen(this.onChange);
    StatusActions.fetch();
  }

  onChange = (data) => {
    let options = data.results.map((obj) => new Option(obj.name, obj.id));
    this.setState({
      options: options,
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

export default StatusSelectContainer;
