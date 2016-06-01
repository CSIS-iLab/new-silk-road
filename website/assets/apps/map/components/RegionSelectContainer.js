import React, { Component, PropTypes } from 'react';
import Option from '../models/Option';
import OptionSelect from './OptionSelect';
import OptionSelectContainer from './OptionSelectContainer';
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

  render() {
    // TODO: Check on `regions__id` vs `initiatives__geographic_scope__id` (Initative regions or Project regions)
    return (
      <OptionSelectContainer
        name='regions'
        displayName='Regions'
        options={this.state.options}
        {...this.props}
        />
    );
  }

}

export default RegionSelectContainer;
