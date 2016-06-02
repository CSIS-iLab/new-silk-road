import React, { Component, PropTypes } from 'react';
import Option from '../models/Option';
import OptionSelect from './OptionSelect';
import RegionStore from '../stores/RegionStore';
import RegionActions from '../actions/RegionActions';

class RegionSelectContainer extends Component {
  static propTypes = {
    onSelect: PropTypes.func
  }

  state = {
    options: [],
    errorMessage: null
  }

  // TODO: Check on `regions` vs `initiatives__geographic_scope` (Initative regions or Project regions)
  get selectName() { return 'regions'; }
  get displayName() { return 'Regions'; }

  componentDidMount() {
    RegionStore.listen(this.onChange);
    RegionActions.fetchRegions();
  }

  onChange = (data) => {
    let options = data.regions.map((obj) => new Option(obj.name, obj.id));
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

export default RegionSelectContainer;
