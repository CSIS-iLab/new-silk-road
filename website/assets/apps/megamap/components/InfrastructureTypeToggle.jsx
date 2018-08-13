import React, { Component } from 'react'
import SearchActions from '../actions/SearchActions';
import InfrastructureIcon from './InfrastructureIcon';

export default class InfrastructureTypeToggle extends Component {
  constructor(props){
    super(props);
    this.handleClickIcon = this.handleClickIcon.bind(this);
    this.handleIconState = this.handleIconState.bind(this);
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
    /* Take the infrastructureTypeId and either add it to, or subtract it from, the state */

    // A copy of the current state
    var selectedInfrastructureTypes = [...this.state.infrastructure_type];
    // If the infrastructureTypeId is already in the selectedInfrastructureTypes,
    // then remove it from selectedInfrastructureTypes.
    var index = selectedInfrastructureTypes.indexOf(infrastructureTypeId);
    if (index !== -1) {
      selectedInfrastructureTypes.splice(index, 1);
    } else {
      // The infrastructureTypeId is not in the selectedInfrastructureTypes,
      // so add it to selectedInfrastructureTypes.
      selectedInfrastructureTypes.push(infrastructureTypeId);
    }
    this.handleIconState(selectedInfrastructureTypes)
  }

  handleIconState(infrastructureTypes){
    /* Set the current state, and submit the search to the backend by calling SearchActions.search(). */
    this.setState({
      infrastructure_type: infrastructureTypes
    }, () => {
      this.props.infrastructureOnClick(this.state),
      SearchActions.search(this.state)
    });
  }

  render() {
    /* Render an InfrastructureIcon component for each id in the state. */
    var infrastructureTypeIcons = [];
    if (this.state.infrastructure_type !== null) {
      // Loop over the infrastructure types in the props (all of the infrastructure types
      // that were passed in from the parent component), and add an InfrastructureIcon
      // component for each.
      for (let i=0; i<this.props.infrastructureTypes.length; i++) {
        infrastructureTypeIcons.push(<InfrastructureIcon returnIdOnClick={this.handleClickIcon} id={this.props.infrastructureTypes[i].value} key={this.props.infrastructureTypes[i].value} />)
      }
    }
    return (
      <div>
        {infrastructureTypeIcons}
      </div>
    )
  }
}
