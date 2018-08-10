import React, { Component } from 'react'
import SearchActions from '../actions/SearchActions';
import InfrastructureIcon from './InfrastructureIcon';

export default class InfrastructureTypeToggle extends Component {
  constructor(props){
    super(props);
    this.handleClickIcon = this.handleClickIcon.bind(this);
    this.handleIconState = this.handleIconState.bind(this);
    this.state = {
      infrastructure_type: [1,2,3,4,6],
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
    return (
      <div>
        <InfrastructureIcon infrastructureTypes={this.props.infrastructureTypes} returnIdOnClick={this.handleClickIcon} id={1} />
        <InfrastructureIcon infrastructureTypes={this.props.infrastructureTypes} returnIdOnClick={this.handleClickIcon} id={2} />
        <InfrastructureIcon infrastructureTypes={this.props.infrastructureTypes} returnIdOnClick={this.handleClickIcon} id={3} />
        <InfrastructureIcon infrastructureTypes={this.props.infrastructureTypes} returnIdOnClick={this.handleClickIcon} id={4} />
        <InfrastructureIcon infrastructureTypes={this.props.infrastructureTypes} returnIdOnClick={this.handleClickIcon} id={6} />
      </div>
    )
  }
}
