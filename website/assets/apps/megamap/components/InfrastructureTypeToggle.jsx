import React, { Component } from 'react'
import SearchActions from '../actions/SearchActions';
import SearchStore from '../stores/SearchStore';
import InfrastructureIcon from './InfrastructureIcon';

export default class InfrastructureTypeToggle extends Component {
  constructor(props){
    super(props);

    this.props = props;
    this.handleClickIcon = this.handleClickIcon.bind(this);
    // Initally, set the state to have null infrastructure_type. When the component
    // receives the props later, we update the state to store the initial value
    // of the props' infrastructureTypes.
    this.state = {
      infrastructure_type: null,
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If this is the first time that the component is receiving props, then
    // update the state from the props.
    if (this.state.infrastructure_type === null && this.props.infrastructureTypes.length > 0) {
      this.setState({
        infrastructure_type: this.props.infrastructureTypes.map(x => x.__proto__.value)
      })
    }
  }

  handleClickIcon(infrastructureTypeId){
    /* Take the infrastructureTypeId and either add it to, or subtract it from,
     * the state. Then, query the backend with the new query parameters.
     */

    // A copy of the current state
    var selectedInfrastructureTypes = [...this.state.infrastructure_type];

    // If the infrastructureTypeId is already in the selectedInfrastructureTypes,
    // then remove it from selectedInfrastructureTypes.
    var index = selectedInfrastructureTypes.indexOf(infrastructureTypeId);
    if (index !== -1) {
      selectedInfrastructureTypes.splice(index, 1);

      // If the array is empty add a dummy value of 0 to filter on
      // to return empty results
      if (selectedInfrastructureTypes.length === 0) {
        selectedInfrastructureTypes.push(0)
      }
    } else {
      // The infrastructureTypeId is not in the selectedInfrastructureTypes,
      // so add it to selectedInfrastructureTypes.
      selectedInfrastructureTypes.push(infrastructureTypeId);

      //
      var index = selectedInfrastructureTypes.indexOf(0);
      if (index !== -1) {
        selectedInfrastructureTypes.splice(index, 1)
      }
    }

    // Get the currect query parameters
    const storeObj = this.props.theState.query;
    const queryParams = {};
    if (storeObj) {
      Object.keys(storeObj).map((key) => {
        if (key !== 'infrastructure_type' && storeObj[key] && storeObj[key].length !== 0 && Object.keys(storeObj[key]).length) {
          queryParams[key] = storeObj[key]
        }
      });
    }
    const options = Object.assign(
          {},
          queryParams,
          { infrastructure_type: selectedInfrastructureTypes },
        );
    // Set the state, and query the backend with the query parameters we just constructed
    this.setState(options, () => {
      this.props.infrastructureOnClick(options),
      SearchActions.search(options)
    });
  }

  render() {
    /* Render an InfrastructureIcon component for each id in the props. */
    var infrastructureTypeIcons = [];
    if (this.state.infrastructure_type !== null) {
      // Loop over the infrastructure types in the props (all of the infrastructure types
      // that were passed in from the parent component), and add an InfrastructureIcon
      // component for each.
      for (let i=0; i<this.props.infrastructureTypes.length; i++) {
        infrastructureTypeIcons.push(<InfrastructureIcon returnIdOnClick={this.handleClickIcon} properties={this.props.infrastructureTypes[i]} key={this.props.infrastructureTypes[i].value} />)
      }
    }
    return (
      <div id="infrastructureToggle">
        {infrastructureTypeIcons}
      </div>
    )
  }
}
